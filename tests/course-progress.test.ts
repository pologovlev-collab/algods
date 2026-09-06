import { describe, expect, it } from 'vitest';

import {
  deriveCourseContinuation,
  deriveCourseLessonStates,
  selectCourseContinuation,
} from '../src/lib/course-progress';

const lessons = [
  { id: 's00-l01', href: '/course/first/', prerequisites: [] },
  { id: 's00-l02', href: '/course/second/', prerequisites: ['s00-l01'] },
  { id: 's01-l01', href: '/course/later/', prerequisites: ['s00-l02'] },
];

describe('course progress decisions', () => {
  it('keeps an explicitly started lesson active even when an earlier ready lesson exists', () => {
    const statuses = { 's01-l01': 'in-progress' } as const;

    expect(deriveCourseLessonStates(lessons, statuses)).toEqual({
      's00-l01': 'ready',
      's00-l02': 'blocked',
      's01-l01': 'in-progress',
    });
    expect(selectCourseContinuation(lessons, statuses)).toEqual(lessons[2]);
    expect(deriveCourseContinuation(lessons, statuses)).toEqual({
      action: 'continue',
      lesson: lessons[2],
    });
  });

  it('selects the first dependency-ready lesson and returns null after completion', () => {
    expect(selectCourseContinuation(lessons, {})).toEqual(lessons[0]);
    expect(deriveCourseContinuation(lessons, {})).toEqual({
      action: 'start',
      lesson: lessons[0],
    });
    expect(selectCourseContinuation(lessons, {
      's00-l01': 'completed',
      's00-l02': 'completed',
      's01-l01': 'completed',
    })).toBeNull();
    expect(deriveCourseContinuation(lessons, {
      's00-l01': 'completed',
      's00-l02': 'completed',
      's01-l01': 'completed',
    })).toBeNull();
  });
});
