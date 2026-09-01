import { describe, expect, it } from 'vitest';

import { patterns } from '../src/data/patterns';
import { referenceTopics } from '../src/data/reference-topics';
import { readLessonDocuments } from '../src/lib/content';
import {
  REFERENCE_CATEGORIES,
  buildReferenceEntries,
  groupReferenceEntries,
} from '../src/lib/reference';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

describe('course reference', () => {
  it('builds stable core and advanced routes in the intended category order', async () => {
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const entries = buildReferenceEntries(lessons);
    const groups = groupReferenceEntries(entries);

    expect(REFERENCE_CATEGORIES.map(({ id }) => id)).toEqual([
      'core-patterns',
      'data-structures',
      'advanced',
    ]);
    expect(groups.map(({ category }) => category.id)).toEqual([
      'core-patterns',
      'data-structures',
      'advanced',
    ]);
    expect(entries).toHaveLength(32);
    expect(entries.filter(({ source }) => source === 'core')).toHaveLength(24);
    expect(entries.filter(({ source }) => source === 'advanced')).toHaveLength(referenceTopics.length);
    expect(entries.map(({ href }) => href)).toContain('/reference/binary-search/');
    expect(entries.map(({ href }) => href)).toContain('/reference/advanced-graph-algorithms/');
  });

  it('keeps slugs, aliases, prerequisites, and course cross-links valid', async () => {
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const lessonIds = new Set(lessons.map(({ id }) => id));
    const patternIds = new Set(patterns.map(({ id }) => id));
    const entries = buildReferenceEntries(lessons);

    expect(new Set(entries.map(({ id }) => id)).size).toBe(entries.length);
    expect(new Set(entries.map(({ slug }) => slug)).size).toBe(entries.length);
    for (const entry of entries) {
      expect(entry.href).toBe(`/reference/${entry.slug}/`);
      expect(entry.aliases.length).toBeGreaterThan(0);
      expect(entry.aliases.every((alias) => alias.trim().length > 0)).toBe(true);
      expect(entry.complexity.length).toBeGreaterThan(0);
      expect(entry.pitfalls.length).toBeGreaterThan(0);
      expect(entry.prerequisiteLessonIds.every((id) => lessonIds.has(id))).toBe(true);
      expect(entry.courseLessonIds.every((id) => lessonIds.has(id))).toBe(true);
      if (entry.patternId) expect(patternIds.has(entry.patternId)).toBe(true);
    }
  });

  it('fails when a core reference points to a lesson that does not teach its pattern', async () => {
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const binarySearch = lessons.find(({ id }) => id === 's08-l01');
    expect(binarySearch).toBeDefined();
    if (!binarySearch) return;

    expect(() => buildReferenceEntries(lessons.map((lesson) =>
      lesson.id === binarySearch.id ? { ...lesson, patterns: ['linear-scan'] } : lesson,
    ))).toThrow('does not teach pattern binary-search');
  });

  it('distinguishes value-only and stable-record memory costs for counting sort', () => {
    const sorting = referenceTopics.find(({ id }) => id === 'ref-classic-sorts');
    const countingComplexity = sorting?.complexity.find((entry) => entry.startsWith('Counting sort:'));

    expect(countingComplexity).toContain('O(k)');
    expect(countingComplexity).toContain('O(n + k)');
    expect(countingComplexity).toMatch(/стабильн/i);
  });
});
