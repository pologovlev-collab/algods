import { describe, expect, it } from 'vitest';

import {
  getLessonNavigation,
  getLessonReadiness,
  getPracticeAnchorLessonId,
  getProblemReadiness,
  orderCourseLessons,
  orderPracticeProblems,
  progressPercent,
  type CourseLessonSummary,
} from '../src/lib/course';

const lessons: CourseLessonSummary[] = [
  { id: 's01-l01', slug: 'containers', title: 'Контейнеры', stage: 1, order: 1, prerequisites: ['s00-l02'] },
  { id: 's00-l02', slug: 'complexity', title: 'Сложность', stage: 0, order: 2, prerequisites: ['s00-l01'] },
  { id: 's00-l01', slug: 'constraints', title: 'Ограничения', stage: 0, order: 1, prerequisites: [] },
];

describe('course ordering and navigation', () => {
  it('orders by stage then lesson order without mutating the source', () => {
    expect(orderCourseLessons(lessons).map(({ id }) => id)).toEqual([
      's00-l01',
      's00-l02',
      's01-l01',
    ]);
    expect(lessons[0]?.id).toBe('s01-l01');
  });

  it('returns literal previous and next neighbors at route boundaries', () => {
    const ordered = orderCourseLessons(lessons);
    expect(getLessonNavigation(ordered, 's00-l01')).toEqual({ previous: null, next: ordered[1] });
    expect(getLessonNavigation(ordered, 's00-l02')).toEqual({
      previous: ordered[0],
      next: ordered[2],
    });
    expect(getLessonNavigation(ordered, 's01-l01')).toEqual({ previous: ordered[1], next: null });
  });

  it('distinguishes ready, blocked, and completed lessons from prerequisites', () => {
    expect(getLessonReadiness(lessons[2]!, new Set())).toBe('ready');
    expect(getLessonReadiness(lessons[1]!, new Set())).toBe('blocked');
    expect(getLessonReadiness(lessons[1]!, new Set(['s00-l01']))).toBe('ready');
    expect(getLessonReadiness(lessons[1]!, new Set(['s00-l01', 's00-l02']))).toBe('completed');
  });

  it('clamps progress for empty and out-of-range totals', () => {
    expect(progressPercent(0, 0)).toBe(0);
    expect(progressPercent(37, 75)).toBe(49);
    expect(progressPercent(80, 75)).toBe(100);
    expect(progressPercent(-1, 75)).toBe(0);
  });

  it('anchors mapped practice after the latest prerequisite lesson', () => {
    const ordered = orderCourseLessons(lessons);

    expect(getPracticeAnchorLessonId(['s00-l01', 's01-l01'], ordered)).toBe('s01-l01');
    expect(getPracticeAnchorLessonId(['unknown'], ordered)).toBeNull();
    expect(getPracticeAnchorLessonId([], ordered)).toBeNull();
  });

  it('marks a problem ready only when every prerequisite lesson is complete', () => {
    expect(getProblemReadiness(['s00-l01', 's00-l02'], new Set(['s00-l01']))).toBe('blocked');
    expect(getProblemReadiness(['s00-l01', 's00-l02'], new Set(['s00-l01', 's00-l02']))).toBe('ready');
  });

  it('orders the practice path by course readiness before official-list order', () => {
    const problems = [
      { id: 'late', recommendedStage: 14, practiceMode: 'guided' as const, difficulty: 'Easy' as const, officialOrder: 1 },
      { id: 'independent', recommendedStage: 2, practiceMode: 'independent' as const, difficulty: 'Medium' as const, officialOrder: 2 },
      { id: 'guided', recommendedStage: 2, practiceMode: 'guided' as const, difficulty: 'Easy' as const, officialOrder: 75 },
    ];

    expect(orderPracticeProblems(problems).map(({ id }) => id)).toEqual([
      'guided',
      'independent',
      'late',
    ]);
    expect(problems[0]?.id).toBe('late');
  });
});
