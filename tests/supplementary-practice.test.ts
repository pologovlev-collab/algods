import { describe, expect, it } from 'vitest';

import { SUPPLEMENTARY_PROGRESS_IDS } from '../src/data/progress-ids';
import { supplementaryProblems } from '../src/data/supplementary-practice';

describe('verified supplementary Russian practice', () => {
  it('ships a small unique CodeRun set with current per-problem provenance', () => {
    expect(supplementaryProblems).toHaveLength(6);
    expect(new Set(supplementaryProblems.map(({ id }) => id)).size).toBe(6);
    expect(supplementaryProblems.map(({ id }) => `coderun:${id}`)).toEqual(
      SUPPLEMENTARY_PROGRESS_IDS,
    );

    for (const problem of supplementaryProblems) {
      expect(problem.provider).toBe('CodeRun');
      expect(problem.verifiedAt).toBe('2026-08-20');
      expect(problem.url).toMatch(/^https:\/\/coderun\.yandex\.ru\/problem\/[a-z0-9-]+$/);
      expect(problem.prerequisiteLessonIds.length).toBeGreaterThan(0);
      expect(problem.learningNoteRu).toMatch(/[А-Яа-яЁё]/);
    }
  });
});
