import { describe, expect, it } from 'vitest';

import { CODERUN_PROVENANCE, coderunProblems } from '../src/data/coderun';
import { VERIFIED_CODERUN_METADATA } from './fixtures/coderun-official';

describe('verified CodeRun practice corpus', () => {
  it('contains at least 30 unique official tasks with canonical provider metadata', () => {
    expect(coderunProblems).toHaveLength(37);
    expect(new Set(coderunProblems.map(({ id }) => id)).size).toBe(37);
    expect(new Set(coderunProblems.map(({ slug }) => slug)).size).toBe(37);
    expect(coderunProblems.map(({ id, title, slug, url, difficulty }) => ({
      id,
      title,
      slug,
      url,
      difficulty,
    }))).toEqual(VERIFIED_CODERUN_METADATA);

    for (const problem of coderunProblems) {
      expect(problem.url).toBe(`https://coderun.yandex.ru/problem/${problem.slug}`);
      expect(problem.title.trim().length).toBeGreaterThan(0);
      expect(problem.verifiedAt).toBe('2026-09-01');
      expect(['Лёгкая', 'Средняя', 'Сложная']).toContain(problem.difficulty);
      expect(problem.prerequisiteLessonIds.length).toBeGreaterThan(0);
      expect(problem.topics.length).toBeGreaterThan(0);
      expect(problem.learningNoteRu).toMatch(/[А-Яа-яЁё]/);
    }
  });

  it('records the official catalog used for direct URL, title, and difficulty verification', () => {
    expect(CODERUN_PROVENANCE).toEqual({
      provider: 'CodeRun',
      verifiedAt: '2026-09-01',
      sourceUrl: 'https://coderun.yandex.ru/catalog?groups=algorithm',
    });
  });

  it('covers the curriculum broadly instead of clustering in one stage or topic', () => {
    expect(new Set(coderunProblems.map(({ recommendedStage }) => recommendedStage)).size)
      .toBeGreaterThanOrEqual(9);
    expect(new Set(coderunProblems.flatMap(({ topics }) => topics)).size)
      .toBeGreaterThanOrEqual(15);
    expect(new Set(coderunProblems.map(({ tier }) => tier)).size).toBe(3);
    expect(new Set(coderunProblems.map(({ practiceMode }) => practiceMode)).size).toBe(3);
  });

  it('preserves the official native difficulty distribution for the selected set', () => {
    const counts = Object.groupBy(coderunProblems, ({ difficulty }) => difficulty);
    expect(counts['Лёгкая']).toHaveLength(20);
    expect(counts['Средняя']).toHaveLength(17);
    expect(counts['Сложная'] ?? []).toHaveLength(0);
  });
});
