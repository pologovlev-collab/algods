import {
  createDefaultProgress,
  exportProgress,
  getActivityDateKeys,
  getLocalDateKey,
  recordLessonStatus,
  recordProblemStatus,
  recordReviewActivity,
  summarizeProgress,
  toggleBookmark,
  type CodeLanguage,
  type ProblemStatus,
  type ProgressState,
} from '../lib/progress';
import {
  importAndSaveProgress,
  loadProgress,
  PROGRESS_STORAGE_KEY,
  resetProgress,
  saveProgress,
} from '../lib/progress-storage';
import { THEME_STORAGE_KEY, isTheme } from '../lib/theme';
import {
  deriveKnowledgeMapState,
  type KnowledgeMapLesson,
  type KnowledgeMapModel,
  type StoredLessonStatus,
} from '../lib/knowledge-map';

const TOTAL_LESSONS = 54;
const TOTAL_PROBLEMS = 75;
const ACTIVITY_DAYS = 84;
const activityDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const activityWeekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
});

const localDateFromKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
};

let state: ProgressState = loadProgress(window.localStorage);
try {
  const standaloneTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (state.theme === 'system' && isTheme(standaloneTheme)) {
    state = { ...state, theme: standaloneTheme };
    saveProgress(window.localStorage, state);
  }
} catch {
  // Progress remains usable when browser preference storage is unavailable.
}

const isLanguage = (value: string | undefined): value is CodeLanguage =>
  value === 'cpp' || value === 'python';

const isProblemStatus = (value: string): value is ProblemStatus =>
  value === 'not-started' ||
  value === 'solved-independent' ||
  value === 'solved-with-help' ||
  value === 'revisit';

const setMessage = (message: string, tone: 'neutral' | 'error' = 'neutral') => {
  const messages = [...document.querySelectorAll<HTMLElement>('[data-state-message]')];
  const target =
    messages.find((element) => element.classList.contains('state-message')) ?? messages[0];

  messages.forEach((element) => {
    const isTarget = element === target;
    element.textContent = isTarget ? message : '';
    if (isTarget) element.dataset.tone = tone;
    else delete element.dataset.tone;
  });
};

const persist = () => {
  if (!saveProgress(window.localStorage, state)) {
    setMessage('Не удалось сохранить изменение в этом браузере.', 'error');
  }
};

const activityCount = (date: string): number => {
  const day = state.activity[date];
  if (!day) return 0;
  return day.lessonCompletions.length + day.problemSolves.length + day.reviews.length;
};

const renderState = () => {
  document.documentElement.dataset.codeLanguage = state.language;
  const resolvedTheme = state.theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : state.theme;
  document.documentElement.dataset.theme = resolvedTheme;
  window.dispatchEvent(new CustomEvent('algods:resolved-theme', { detail: resolvedTheme }));
  try {
    if (state.theme === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, state.theme);
  } catch {
    // The in-page theme still applies if the mirrored pre-paint preference cannot be written.
  }

  document.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach((button) => {
    const selected = button.dataset.languageChoice === state.language;
    button.setAttribute('aria-pressed', String(selected));
  });

  const completed = new Set(
    Object.entries(state.lessons)
      .filter(([, entry]) => entry.status === 'completed')
      .map(([id]) => id),
  );

  document.querySelectorAll<HTMLElement>('[data-lesson-id]').forEach((element) => {
    const lessonId = element.dataset.lessonId;
    if (!lessonId) return;
    const savedStatus = state.lessons[lessonId]?.status ?? 'not-started';
    const prerequisites = (element.dataset.prerequisites ?? '')
      .split(',')
      .filter(Boolean);
    const readiness =
      savedStatus === 'completed'
        ? 'completed'
        : prerequisites.every((id) => completed.has(id))
          ? 'ready'
          : 'blocked';
    element.dataset.progressState = readiness;
    element.querySelectorAll<HTMLElement>('[data-lesson-state-label]').forEach((label) => {
      label.textContent =
        readiness === 'completed'
          ? 'Завершён'
          : readiness === 'ready'
            ? savedStatus === 'in-progress' ? 'В процессе' : 'Можно начать'
            : 'Сначала пройдите зависимости';
    });
    element.querySelectorAll<HTMLButtonElement>('[data-lesson-status-value]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lessonStatusValue === savedStatus));
    });
  });

  document.querySelectorAll<HTMLSelectElement>('[data-problem-status]').forEach((select) => {
    const problemId = select.dataset.problemStatus;
    if (!problemId) return;
    select.value = state.problems[problemId]?.status ?? 'not-started';
  });

  document.querySelectorAll<HTMLElement>('[data-problem-prerequisites]').forEach((element) => {
    const prerequisites = (element.dataset.problemPrerequisites ?? '').split(',').filter(Boolean);
    const ready = prerequisites.every((id) => completed.has(id));
    element.dataset.problemReadiness = ready ? 'ready' : 'blocked';
    element.querySelectorAll<HTMLElement>('[data-problem-readiness-label]').forEach((label) => {
      label.textContent = ready ? 'Готово к решению' : 'Сначала завершите уроки-зависимости';
    });
  });

  document.querySelectorAll<HTMLElement>('[data-prerequisite-id]').forEach((element) => {
    const prerequisiteId = element.dataset.prerequisiteId;
    const complete = prerequisiteId ? completed.has(prerequisiteId) : false;
    element.dataset.prerequisiteState = complete ? 'completed' : 'pending';
    element.querySelectorAll<HTMLElement>('[data-prerequisite-label]').forEach((label) => {
      label.textContent = complete ? 'пройдено' : 'нужно пройти';
    });
  });

  const mapData = document.querySelector<HTMLScriptElement>('[data-knowledge-map-data]');
  if (mapData?.textContent) {
    try {
      const payload = JSON.parse(mapData.textContent) as {
        map: KnowledgeMapModel;
        lessons: KnowledgeMapLesson[];
      };
      const statuses = Object.fromEntries(
        Object.entries(state.lessons).map(([id, entry]) => [id, entry.status]),
      ) as Record<string, StoredLessonStatus>;
      const mapState = deriveKnowledgeMapState(payload.map, payload.lessons, statuses);
      const nextStageId = payload.lessons.find(({ id }) => id === mapState.nextLessonId)?.stage;

      document.querySelectorAll<HTMLElement>('[data-map-stage-id]').forEach((element) => {
        const stageId = Number(element.dataset.mapStageId);
        const stageState = mapState.stageStates[stageId] ?? 'blocked';
        element.dataset.mapStageState = stageState;
        element.dataset.mapStageNext = String(stageId === nextStageId);
        element.querySelectorAll<HTMLElement>('[data-map-stage-state-label]').forEach((label) => {
          label.textContent = stageState === 'completed'
            ? 'Завершён'
            : stageState === 'in-progress'
              ? 'В процессе'
              : stageState === 'ready'
                ? 'Можно начать'
                : 'Нужны зависимости';
        });
      });
    } catch {
      // The map keeps its server-rendered fallback state if embedded data is malformed.
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-bookmark-id]').forEach((button) => {
    const bookmarkId = button.dataset.bookmarkId;
    if (!bookmarkId) return;
    const active = state.bookmarks.includes(bookmarkId);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'В закладках' : 'Добавить в закладки';
  });

  const summary = summarizeProgress(state, TOTAL_LESSONS, TOTAL_PROBLEMS);
  const values: Record<string, number> = {
    completedLessons: summary.completedLessons,
    totalLessons: summary.totalLessons,
    solvedProblems: summary.solvedProblems,
    totalProblems: summary.totalProblems,
    independentProblems: summary.independentProblems,
    assistedProblems: summary.assistedProblems,
    revisitProblems: summary.revisitProblems,
  };
  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll<HTMLElement>(`[data-progress-value="${key}"]`).forEach((element) => {
      element.textContent = String(value);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-progress-gauge]').forEach((gauge) => {
    const total = Number(gauge.dataset.progressTotal ?? TOTAL_PROBLEMS);
    const count = Number(gauge.dataset.progressKind === 'lessons' ? summary.completedLessons : summary.solvedProblems);
    const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
    gauge.style.setProperty('--gauge-progress', `${percent * 3.6}deg`);
    gauge.setAttribute('aria-valuenow', String(count));
    gauge.querySelectorAll<HTMLElement>('[data-gauge-value]').forEach((element) => {
      element.textContent = `${count}/${total}`;
    });
  });

  const activityDates = getActivityDateKeys(new Date(), ACTIVITY_DAYS);
  document.querySelectorAll<HTMLElement>('[data-activity-weekday]').forEach((label) => {
    const index = Number(label.dataset.activityWeekday);
    const date = activityDates[index];
    if (date) label.textContent = activityWeekdayFormatter.format(localDateFromKey(date));
  });
  const firstActivityDate = activityDates[0];
  const lastActivityDate = activityDates.at(-1);
  if (firstActivityDate && lastActivityDate) {
    const firstLabel = activityDateFormatter.format(localDateFromKey(firstActivityDate));
    const lastLabel = activityDateFormatter.format(localDateFromKey(lastActivityDate));
    document.querySelectorAll<HTMLElement>('[data-activity-range]').forEach((range) => {
      range.textContent = `${firstLabel} — ${lastLabel}`;
    });
  }
  const activeDateDescriptions: string[] = [];
  document.querySelectorAll<HTMLElement>('[data-activity-index]').forEach((cell) => {
    const index = Number(cell.dataset.activityIndex);
    const date = activityDates[index];
    if (!date) return;
    cell.dataset.activityDate = date;
    const count = activityCount(date);
    cell.dataset.activityLevel = count === 0 ? '0' : count === 1 ? '1' : count <= 3 ? '2' : '3';
    const visibleDate = activityDateFormatter.format(localDateFromKey(date));
    cell.title = `${visibleDate}: ${count}`;
    if (count > 0) {
      activeDateDescriptions.push(`${visibleDate}: ${count} ${count === 1 ? 'действие' : 'действий'}`);
    }
  });
  document.querySelectorAll<HTMLElement>('[data-activity-summary]').forEach((summaryElement) => {
    summaryElement.textContent = activeDateDescriptions.length > 0
      ? `Учебная активность: ${activeDateDescriptions.join('; ')}.`
      : 'Учебной активности за последние 12 недель пока нет.';
  });

  const coursePlanElement = document.querySelector<HTMLElement>('[data-course-plan]');
  let coursePlan: Array<{ id: string; href: string; prerequisites: string[] }> = [];
  try {
    coursePlan = JSON.parse(coursePlanElement?.dataset.coursePlan ?? '[]') as typeof coursePlan;
  } catch {
    coursePlan = [];
  }
  const continueLesson =
    coursePlan.find(
      ({ id, prerequisites }) =>
        !completed.has(id) && prerequisites.every((prerequisite) => completed.has(prerequisite)),
    ) ?? coursePlan.find(({ id }) => !completed.has(id));
  document.querySelectorAll<HTMLAnchorElement>('[data-continue-course]').forEach((link) => {
    if (continueLesson) {
      link.href = continueLesson.href;
      link.textContent = completed.size === 0 ? 'Начать первый урок' : 'Продолжить курс';
    } else if (coursePlan.length > 0) {
      link.href = '/course/';
      link.textContent = 'Повторить курс';
    }
  });

  applyPracticeFilters();
};

const prepareCodeBlocks = () => {
  document.querySelectorAll<HTMLElement>('.lesson-body pre').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-frame')) return;
    const code = pre.querySelector<HTMLElement>('code');
    const languageClass = [...(code?.classList ?? [])].find((name) => name.startsWith('language-'));
    const rawLanguage = pre.dataset.language ?? languageClass?.replace('language-', '');
    const language = rawLanguage === 'cpp' ? 'cpp' : rawLanguage === 'python' ? 'python' : null;
    if (!language || !pre.parentNode) return;

    pre.dataset.codeLanguage = language;
    const previous = pre.previousElementSibling;
    if (previous?.tagName === 'H3') previous.setAttribute('data-code-language', language);

    const frame = document.createElement('div');
    frame.className = 'code-frame';
    frame.dataset.codeLanguage = language;
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const languageSwitch = document.createElement('div');
    languageSwitch.className = 'code-language-switch';
    languageSwitch.setAttribute('role', 'group');
    languageSwitch.setAttribute('aria-label', 'Язык этого примера');
    const cppChoice = document.createElement('button');
    cppChoice.type = 'button';
    cppChoice.dataset.languageChoice = 'cpp';
    cppChoice.textContent = 'C++17';
    const pythonChoice = document.createElement('button');
    pythonChoice.type = 'button';
    pythonChoice.dataset.languageChoice = 'python';
    pythonChoice.textContent = 'Python 3';
    languageSwitch.append(cppChoice, pythonChoice);
    const copy = document.createElement('button');
    copy.className = 'code-copy';
    copy.type = 'button';
    copy.textContent = 'Копировать';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code?.textContent ?? '');
        copy.textContent = 'Скопировано';
      } catch {
        copy.textContent = 'Не удалось скопировать';
      }
      window.setTimeout(() => {
        copy.textContent = 'Копировать';
      }, 1600);
    });
    toolbar.append(languageSwitch, copy);
    pre.parentNode.insertBefore(frame, pre);
    frame.append(toolbar, pre);
  });
};

const applyPracticeFilters = () => {
  document.querySelectorAll<HTMLElement>('[data-practice-explorer]').forEach((explorer) => {
    const query =
      explorer.querySelector<HTMLInputElement>('[data-filter-query]')?.value.trim().toLocaleLowerCase('ru') ?? '';
    const stage = explorer.querySelector<HTMLSelectElement>('[data-filter-stage]')?.value ?? 'all';
    const mode = explorer.querySelector<HTMLSelectElement>('[data-filter-mode]')?.value ?? 'all';
    const status = explorer.querySelector<HTMLSelectElement>('[data-filter-status]')?.value ?? 'all';
    let visible = 0;

    explorer.querySelectorAll<HTMLElement>('[data-practice-row]').forEach((row) => {
      const problemId = row.dataset.problemId ?? '';
      const problemStatus = state.problems[problemId]?.status ?? 'not-started';
      const matches =
        (!query || (row.dataset.searchText ?? '').includes(query)) &&
        (stage === 'all' || row.dataset.stage === stage) &&
        (mode === 'all' || row.dataset.mode === mode) &&
        (status === 'all' || problemStatus === status);
      row.hidden = !matches;
      if (matches) visible += 1;
    });

    explorer.querySelectorAll<HTMLElement>('[data-practice-group]').forEach((group) => {
      group.hidden = !group.querySelector('[data-practice-row]:not([hidden])');
    });
    const count = explorer.querySelector<HTMLElement>('[data-filter-count]');
    if (count) count.textContent = String(visible);
  });
};

prepareCodeBlocks();
renderState();

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const languageButton = target.closest<HTMLButtonElement>('[data-language-choice]');
  if (languageButton && isLanguage(languageButton.dataset.languageChoice)) {
    state = { ...state, language: languageButton.dataset.languageChoice };
    persist();
    renderState();
    return;
  }

  const lessonButton = target.closest<HTMLButtonElement>('[data-lesson-status-value]');
  const lessonContainer = lessonButton?.closest<HTMLElement>('[data-lesson-id]');
  if (lessonButton && lessonContainer?.dataset.lessonId) {
    const status = lessonButton.dataset.lessonStatusValue;
    if (status === 'in-progress' || status === 'completed') {
      const now = new Date();
      state = recordLessonStatus(
        state,
        lessonContainer.dataset.lessonId,
        status,
        now.toISOString(),
        getLocalDateKey(now),
      );
      persist();
      renderState();
    }
    return;
  }

  const bookmarkButton = target.closest<HTMLButtonElement>('[data-bookmark-id]');
  if (bookmarkButton?.dataset.bookmarkId) {
    state = toggleBookmark(state, bookmarkButton.dataset.bookmarkId);
    persist();
    renderState();
    return;
  }

  if (target.closest('[data-export-progress]')) {
    const blob = new Blob([exportProgress(state)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `algods-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(href);
    setMessage('Файл прогресса подготовлен.');
    return;
  }

  const resetDialog = document.querySelector<HTMLDialogElement>('[data-reset-dialog]');
  if (target.closest('[data-reset-open]')) resetDialog?.showModal();
  if (target.closest('[data-reset-cancel]')) resetDialog?.close();
  if (target.closest('[data-reset-confirm]')) {
    if (resetProgress(window.localStorage)) {
      state = createDefaultProgress();
      resetDialog?.close();
      setMessage('Локальный прогресс сброшен.');
      renderState();
    } else {
      setMessage('Не удалось сбросить прогресс в этом браузере.', 'error');
    }
  }
});

document.addEventListener('change', async (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.matches('[data-problem-status]')) {
    const problemId = target.dataset.problemStatus;
    if (problemId && isProblemStatus(target.value)) {
      const previous = state.problems[problemId]?.status;
      const now = new Date();
      state = recordProblemStatus(
        state,
        problemId,
        target.value,
        now.toISOString(),
        getLocalDateKey(now),
      );
      if (
        previous === 'revisit' &&
        (target.value === 'solved-independent' || target.value === 'solved-with-help')
      ) {
        state = recordReviewActivity(
          state,
          problemId,
          now.toISOString(),
          getLocalDateKey(now),
        );
      }
      persist();
      renderState();
    }
    return;
  }

  if (target instanceof HTMLInputElement && target.matches('[data-import-progress]')) {
    const file = target.files?.[0];
    if (!file) return;
    const result = importAndSaveProgress(window.localStorage, await file.text());
    if (result.ok) {
      state = result.value;
      setMessage('Прогресс импортирован.');
      renderState();
    } else {
      setMessage(result.error, 'error');
    }
    target.value = '';
    return;
  }

  if (target instanceof Element && target.closest('[data-practice-explorer]')) {
    applyPracticeFilters();
  }
});

document.addEventListener('input', (event) => {
  if (event.target instanceof Element && event.target.closest('[data-practice-explorer]')) {
    applyPracticeFilters();
  }
});

document.addEventListener('submit', (event) => {
  if (event.target instanceof HTMLFormElement && event.target.matches('[data-practice-filters]')) {
    event.preventDefault();
    applyPracticeFilters();
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === PROGRESS_STORAGE_KEY) {
    state = loadProgress(window.localStorage);
    renderState();
  }
});

window.addEventListener('algods:theme-change', (event) => {
  if (!(event instanceof CustomEvent) || !isTheme(event.detail)) return;
  state = { ...state, theme: event.detail };
  persist();
  renderState();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.theme === 'system') renderState();
});
