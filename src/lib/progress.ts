export const CURRENT_PROGRESS_VERSION = 2 as const;

export type CodeLanguage = 'cpp' | 'python';
export type ColorTheme = 'system' | 'light' | 'dark';
export type LessonStatus = 'in-progress' | 'completed';
export type ProblemStatus =
  | 'not-started'
  | 'solved-independent'
  | 'solved-with-help'
  | 'revisit';

export interface TimedStatus<TStatus extends string> {
  status: TStatus;
  updatedAt: string;
}

export interface ActivityDay {
  lessonCompletions: string[];
  problemSolves: string[];
  reviews: string[];
}

export interface ProgressState {
  version: typeof CURRENT_PROGRESS_VERSION;
  language: CodeLanguage;
  theme: ColorTheme;
  lessons: Record<string, TimedStatus<LessonStatus>>;
  problems: Record<string, TimedStatus<Exclude<ProblemStatus, 'not-started'>>>;
  bookmarks: string[];
  revisit: string[];
  activity: Record<string, ActivityDay>;
}

interface ProgressV1 {
  version: 1;
  language?: CodeLanguage;
  theme?: ColorTheme;
  completedLessonIds?: string[];
  problemStatuses?: Record<string, ProblemStatus>;
  bookmarks?: string[];
}

export interface ProgressSummary {
  completedLessons: number;
  totalLessons: number;
  solvedProblems: number;
  totalProblems: number;
  independentProblems: number;
  assistedProblems: number;
  revisitProblems: number;
}

export type ProgressImportResult =
  | { ok: true; value: ProgressState }
  | { ok: false; error: string };

const EMPTY_ACTIVITY: ActivityDay = {
  lessonCompletions: [],
  problemSolves: [],
  reviews: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length > 0);

const isCodeLanguage = (value: unknown): value is CodeLanguage =>
  value === 'cpp' || value === 'python';

const isTheme = (value: unknown): value is ColorTheme =>
  value === 'system' || value === 'light' || value === 'dark';

const isLessonStatus = (value: unknown): value is LessonStatus =>
  value === 'in-progress' || value === 'completed';

const isSavedProblemStatus = (
  value: unknown,
): value is Exclude<ProblemStatus, 'not-started'> =>
  value === 'solved-independent' || value === 'solved-with-help' || value === 'revisit';

const isTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

const unique = (values: string[]): string[] => [...new Set(values)];

const dateKey = (timestamp: string): string => timestamp.slice(0, 10);

const isCalendarDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const nextActivity = (
  activity: ProgressState['activity'],
  timestamp: string,
  field: keyof ActivityDay,
  entityId: string,
  uniqueAcrossHistory = true,
): ProgressState['activity'] => {
  const key = dateKey(timestamp);
  const current = activity[key] ?? EMPTY_ACTIVITY;

  if (
    (uniqueAcrossHistory && Object.values(activity).some((day) => day[field].includes(entityId))) ||
    current[field].includes(entityId)
  ) {
    return activity;
  }

  return {
    ...activity,
    [key]: {
      ...current,
      [field]: [...current[field], entityId],
    },
  };
};

const readTimedStatuses = <TStatus extends string>(
  value: unknown,
  isStatus: (candidate: unknown) => candidate is TStatus,
): Record<string, TimedStatus<TStatus>> | null => {
  if (!isRecord(value)) return null;

  const result: Record<string, TimedStatus<TStatus>> = {};
  for (const [id, candidate] of Object.entries(value)) {
    if (!id || !isRecord(candidate) || !isStatus(candidate.status) || !isTimestamp(candidate.updatedAt)) {
      return null;
    }
    result[id] = { status: candidate.status, updatedAt: candidate.updatedAt };
  }
  return result;
};

const readActivity = (value: unknown): ProgressState['activity'] | null => {
  if (!isRecord(value)) return null;

  const result: ProgressState['activity'] = {};
  for (const [date, candidate] of Object.entries(value)) {
    if (
      !isCalendarDate(date) ||
      !isRecord(candidate) ||
      !isStringArray(candidate.lessonCompletions) ||
      !isStringArray(candidate.problemSolves) ||
      !isStringArray(candidate.reviews) ||
      unique(candidate.lessonCompletions).length !== candidate.lessonCompletions.length ||
      unique(candidate.problemSolves).length !== candidate.problemSolves.length ||
      unique(candidate.reviews).length !== candidate.reviews.length
    ) {
      return null;
    }
    result[date] = {
      lessonCompletions: [...candidate.lessonCompletions],
      problemSolves: [...candidate.problemSolves],
      reviews: [...candidate.reviews],
    };
  }
  return result;
};

const parseV2 = (value: unknown): ProgressState | null => {
  if (!isRecord(value) || value.version !== CURRENT_PROGRESS_VERSION) return null;
  if (!isCodeLanguage(value.language) || !isTheme(value.theme)) return null;

  const lessons = readTimedStatuses(value.lessons, isLessonStatus);
  const problems = readTimedStatuses(value.problems, isSavedProblemStatus);
  const activity = readActivity(value.activity);
  if (
    lessons === null ||
    problems === null ||
    activity === null ||
    !isStringArray(value.bookmarks) ||
    !isStringArray(value.revisit)
  ) {
    return null;
  }

  const revisitFromProblems = Object.entries(problems)
    .filter(([, entry]) => entry.status === 'revisit')
    .map(([id]) => id);

  return {
    version: CURRENT_PROGRESS_VERSION,
    language: value.language,
    theme: value.theme,
    lessons,
    problems,
    bookmarks: unique(value.bookmarks),
    revisit: unique([...value.revisit, ...revisitFromProblems]).filter(
      (id) => problems[id]?.status === 'revisit',
    ),
    activity,
  };
};

const isProgressV1 = (value: unknown): value is ProgressV1 => {
  if (!isRecord(value) || value.version !== 1) return false;
  if (value.language !== undefined && !isCodeLanguage(value.language)) return false;
  if (value.theme !== undefined && !isTheme(value.theme)) return false;
  if (value.completedLessonIds !== undefined && !isStringArray(value.completedLessonIds)) return false;
  if (value.bookmarks !== undefined && !isStringArray(value.bookmarks)) return false;
  if (value.problemStatuses !== undefined) {
    if (!isRecord(value.problemStatuses)) return false;
    if (
      Object.values(value.problemStatuses).some(
        (status) => status !== 'not-started' && !isSavedProblemStatus(status),
      )
    ) {
      return false;
    }
  }
  return true;
};

export function createDefaultProgress(): ProgressState {
  return {
    version: CURRENT_PROGRESS_VERSION,
    language: 'cpp',
    theme: 'system',
    lessons: {},
    problems: {},
    bookmarks: [],
    revisit: [],
    activity: {},
  };
}

export function migrateProgress(value: unknown, timestamp = new Date().toISOString()): ProgressState {
  const current = parseV2(value);
  if (current) return current;
  if (!isProgressV1(value)) return createDefaultProgress();

  const lessons: ProgressState['lessons'] = {};
  for (const id of unique(value.completedLessonIds ?? [])) {
    lessons[id] = { status: 'completed', updatedAt: timestamp };
  }

  const problems: ProgressState['problems'] = {};
  for (const [id, status] of Object.entries(value.problemStatuses ?? {})) {
    if (status !== 'not-started') {
      problems[id] = { status, updatedAt: timestamp };
    }
  }

  return {
    version: CURRENT_PROGRESS_VERSION,
    language: value.language ?? 'cpp',
    theme: value.theme ?? 'system',
    lessons,
    problems,
    bookmarks: unique(value.bookmarks ?? []),
    revisit: Object.entries(problems)
      .filter(([, entry]) => entry.status === 'revisit')
      .map(([id]) => id),
    activity: {},
  };
}

export function recordLessonStatus(
  state: ProgressState,
  lessonId: string,
  status: LessonStatus,
  timestamp = new Date().toISOString(),
): ProgressState {
  const previous = state.lessons[lessonId]?.status;
  const activity =
    status === 'completed' && previous !== 'completed'
      ? nextActivity(state.activity, timestamp, 'lessonCompletions', lessonId)
      : state.activity;

  return {
    ...state,
    lessons: {
      ...state.lessons,
      [lessonId]: { status, updatedAt: timestamp },
    },
    activity,
  };
}

export function recordProblemStatus(
  state: ProgressState,
  problemId: string,
  status: ProblemStatus,
  timestamp = new Date().toISOString(),
): ProgressState {
  const previous = state.problems[problemId]?.status ?? 'not-started';
  const problems = { ...state.problems };
  if (status === 'not-started') {
    delete problems[problemId];
  } else {
    problems[problemId] = { status, updatedAt: timestamp };
  }

  let activity = state.activity;
  const isSolved = status === 'solved-independent' || status === 'solved-with-help';
  const wasSolved = previous === 'solved-independent' || previous === 'solved-with-help';
  if (isSolved && !wasSolved) {
    activity = nextActivity(activity, timestamp, 'problemSolves', problemId);
  }

  return {
    ...state,
    problems,
    revisit:
      status === 'revisit'
        ? unique([...state.revisit, problemId])
        : state.revisit.filter((id) => id !== problemId),
    activity,
  };
}

export function recordReviewActivity(
  state: ProgressState,
  problemId: string,
  timestamp = new Date().toISOString(),
): ProgressState {
  return {
    ...state,
    activity: nextActivity(state.activity, timestamp, 'reviews', problemId, false),
  };
}

export function toggleBookmark(state: ProgressState, bookmarkId: string): ProgressState {
  const exists = state.bookmarks.includes(bookmarkId);
  return {
    ...state,
    bookmarks: exists
      ? state.bookmarks.filter((id) => id !== bookmarkId)
      : [...state.bookmarks, bookmarkId],
  };
}

export function exportProgress(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function importProgress(
  serialized: string,
  timestamp = new Date().toISOString(),
): ProgressImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return { ok: false, error: 'Файл не содержит корректный JSON.' };
  }

  if (!isRecord(parsed) || (parsed.version !== 1 && parsed.version !== CURRENT_PROGRESS_VERSION)) {
    return { ok: false, error: 'Версия файла прогресса не поддерживается.' };
  }

  const migrated = parsed.version === CURRENT_PROGRESS_VERSION ? parseV2(parsed) : migrateProgress(parsed, timestamp);
  if (!migrated || (parsed.version === 1 && !isProgressV1(parsed))) {
    return { ok: false, error: 'Файл прогресса повреждён или имеет неверный формат.' };
  }

  return { ok: true, value: migrated };
}

export function summarizeProgress(
  state: ProgressState,
  totalLessons: number,
  totalProblems: number,
): ProgressSummary {
  const lessonEntries = Object.values(state.lessons);
  const problemEntries = Object.values(state.problems);
  const independentProblems = problemEntries.filter(
    (entry) => entry.status === 'solved-independent',
  ).length;
  const assistedProblems = problemEntries.filter(
    (entry) => entry.status === 'solved-with-help',
  ).length;

  return {
    completedLessons: lessonEntries.filter((entry) => entry.status === 'completed').length,
    totalLessons,
    solvedProblems: independentProblems + assistedProblems,
    totalProblems,
    independentProblems,
    assistedProblems,
    revisitProblems: problemEntries.filter((entry) => entry.status === 'revisit').length,
  };
}
