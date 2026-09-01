import { describe, expect, it } from 'vitest';

import {
  CURRENT_PROGRESS_VERSION,
  createDefaultProgress,
  exportProgress,
  getActivityDateKeys,
  getLocalDateKey,
  importProgress,
  migrateProgress,
  recordReviewActivity,
  recordLessonStatus,
  recordProblemStatus,
  summarizeProgress,
  toggleBookmark,
} from '../src/lib/progress';
import { LEGACY_PRACTICE_PROGRESS_IDS } from './fixtures/practice-compatibility';

const now = '2026-08-20T10:00:00.000Z';

describe('progress schema', () => {
  it('accepts every legacy practice ID in an existing v2 save', () => {
    const updatedAt = '2026-08-20T10:00:00.000Z';
    const problems = Object.fromEntries(LEGACY_PRACTICE_PROGRESS_IDS.map((id) => [
      id,
      { status: 'solved-independent', updatedAt },
    ]));

    const result = importProgress(JSON.stringify({
      version: 2,
      language: 'cpp',
      theme: 'system',
      lessons: {},
      problems,
      bookmarks: [],
      revisit: [],
      activity: {},
    }));

    expect(result.ok).toBe(true);
    if (result.ok) expect(Object.keys(result.value.problems)).toEqual(LEGACY_PRACTICE_PROGRESS_IDS);
  });

  it('starts with private, empty learning state and explicit preferences', () => {
    expect(createDefaultProgress()).toEqual({
      version: CURRENT_PROGRESS_VERSION,
      language: 'cpp',
      theme: 'system',
      lessons: {},
      problems: {},
      bookmarks: [],
      revisit: [],
      activity: {},
    });
  });

  it('migrates the supported v1 shape without inventing activity', () => {
    expect(
      migrateProgress(
        {
          version: 1,
          language: 'python',
          theme: 'dark',
          completedLessonIds: ['s00-l01'],
          problemStatuses: {
            'leetcode:1768': 'solved-with-help',
            'leetcode:283': 'revisit',
            'coderun:20': 'solved-independent',
          },
          bookmarks: ['lesson:s00-l01'],
        },
        now,
      ),
    ).toEqual({
      version: 2,
      language: 'python',
      theme: 'dark',
      lessons: {
        's00-l01': { status: 'completed', updatedAt: now },
      },
      problems: {
        'leetcode:1768': { status: 'solved-with-help', updatedAt: now },
        'leetcode:283': { status: 'revisit', updatedAt: now },
        'coderun:20': { status: 'solved-independent', updatedAt: now },
      },
      bookmarks: ['lesson:s00-l01'],
      revisit: ['leetcode:283'],
      activity: {},
    });
  });

  it('falls back safely when persisted state is malformed', () => {
    expect(migrateProgress({ version: 2, language: 'ruby' }, now)).toEqual(
      createDefaultProgress(),
    );
    expect(migrateProgress('not-an-object', now)).toEqual(createDefaultProgress());
  });
});

describe('progress transitions', () => {
  it('builds the activity window from the learner local calendar date', () => {
    const localReference = new Date(2026, 2, 1, 0, 30);

    expect(getLocalDateKey(localReference)).toBe('2026-03-01');
    expect(getActivityDateKeys(localReference, 4)).toEqual([
      '2026-02-26',
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
    ]);
  });

  it('records a lesson completion once and does not inflate activity on repeat', () => {
    const first = recordLessonStatus(
      createDefaultProgress(),
      's00-l01',
      'completed',
      now,
    );
    const second = recordLessonStatus(first, 's00-l01', 'completed', now);

    expect(second.lessons['s00-l01']).toEqual({ status: 'completed', updatedAt: now });
    expect(second.activity['2026-08-20']).toEqual({
      lessonCompletions: ['s00-l01'],
      problemSolves: [],
      reviews: [],
    });
  });

  it('does not duplicate a milestone after a status round-trip', () => {
    const completed = recordLessonStatus(
      createDefaultProgress(),
      's00-l01',
      'completed',
      now,
    );
    const reopened = recordLessonStatus(completed, 's00-l01', 'in-progress', now);
    const completedAgain = recordLessonStatus(reopened, 's00-l01', 'completed', now);

    expect(completedAgain.activity['2026-08-20']?.lessonCompletions).toEqual(['s00-l01']);
  });

  it('keeps revisit membership consistent with problem status', () => {
    const revisit = recordProblemStatus(
      createDefaultProgress(),
      'leetcode:1768',
      'revisit',
      now,
    );
    const solved = recordProblemStatus(
      revisit,
      'leetcode:1768',
      'solved-independent',
      now,
    );

    expect(revisit.revisit).toEqual(['leetcode:1768']);
    expect(solved.revisit).toEqual([]);
    expect(solved.activity['2026-08-20']).toEqual({
      lessonCompletions: [],
      problemSolves: ['leetcode:1768'],
      reviews: [],
    });
  });

  it('records an actual review separately from marking a problem for revisit', () => {
    const revisit = recordProblemStatus(
      createDefaultProgress(),
      'leetcode:1768',
      'revisit',
      now,
    );
    const reviewed = recordReviewActivity(revisit, 'leetcode:1768', now);
    const duplicate = recordReviewActivity(reviewed, 'leetcode:1768', now);

    expect(revisit.activity).toEqual({});
    expect(reviewed.activity['2026-08-20']?.reviews).toEqual(['leetcode:1768']);
    expect(duplicate.activity).toEqual(reviewed.activity);
  });

  it('toggles bookmarks without duplicates and leaves the input immutable', () => {
    const initial = createDefaultProgress();
    const bookmarked = toggleBookmark(initial, 'lesson:s08-l01');
    const removed = toggleBookmark(bookmarked, 'lesson:s08-l01');

    expect(initial.bookmarks).toEqual([]);
    expect(bookmarked.bookmarks).toEqual(['lesson:s08-l01']);
    expect(removed.bookmarks).toEqual([]);
  });
});

describe('progress portability', () => {
  it('round-trips a valid export and reports a hand-checked summary', () => {
    let state = recordLessonStatus(
      createDefaultProgress(),
      's00-l01',
      'completed',
      now,
    );
    state = recordProblemStatus(state, 'leetcode:1768', 'solved-with-help', now);

    const restored = importProgress(exportProgress(state), now);

    expect(restored).toEqual({ ok: true, value: state });
    expect(summarizeProgress(state, 54, 75)).toEqual({
      completedLessons: 1,
      totalLessons: 54,
      solvedProblems: 1,
      totalProblems: 75,
      independentProblems: 0,
      assistedProblems: 1,
      revisitProblems: 0,
    });
  });

  it('persists supplementary practice without inflating the LeetCode 75 gauge', () => {
    const supplementary = recordProblemStatus(
      createDefaultProgress(),
      'coderun:20',
      'solved-independent',
      now,
    );

    expect(importProgress(exportProgress(supplementary), now)).toEqual({
      ok: true,
      value: supplementary,
    });
    expect(summarizeProgress(supplementary, 54, 75)).toMatchObject({
      solvedProblems: 0,
      independentProblems: 0,
      assistedProblems: 0,
      revisitProblems: 0,
      totalProblems: 75,
    });
  });

  it('rejects malformed or unsupported imports instead of partially accepting them', () => {
    expect(importProgress('{broken', now)).toEqual({
      ok: false,
      error: 'Файл не содержит корректный JSON.',
    });
    expect(importProgress('{"version":99}', now)).toEqual({
      ok: false,
      error: 'Версия файла прогресса не поддерживается.',
    });
  });

  it('rejects impossible activity dates', () => {
    const invalid = {
      ...createDefaultProgress(),
      activity: {
        '2026-99-99': {
          lessonCompletions: [],
          problemSolves: [],
          reviews: [],
        },
      },
    };

    expect(importProgress(JSON.stringify(invalid), now)).toEqual({
      ok: false,
      error: 'Файл прогресса повреждён или имеет неверный формат.',
    });
  });

  it('rejects unknown entity IDs instead of inflating progress totals', () => {
    const unknownLesson = {
      ...createDefaultProgress(),
      lessons: { 's99-l99': { status: 'completed', updatedAt: now } },
    };
    const unknownProblem = {
      ...createDefaultProgress(),
      problems: { 'leetcode:999999': { status: 'solved-independent', updatedAt: now } },
    };

    expect(importProgress(JSON.stringify(unknownLesson), now).ok).toBe(false);
    expect(importProgress(JSON.stringify(unknownProblem), now).ok).toBe(false);
  });
});
