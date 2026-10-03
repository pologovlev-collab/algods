import { expect, it } from 'vitest';
import { patternGuide } from '../src/data/pattern-guide';
import { patterns } from '../src/data/patterns';
import { readLessonDocuments } from '../src/lib/content';
import { buildReferenceEntries } from '../src/lib/reference';

it('connects every decision guide to an actual lesson and reference for its pattern', async () => {
  const lessons = (await readLessonDocuments(new URL('../src/content/lessons/', import.meta.url))).map(({ data }) => data);
  const references = buildReferenceEntries(lessons);
  expect(patternGuide).toHaveLength(12);
  expect(new Set(patternGuide.map(({ id }) => id)).size).toBe(12);
  for (const item of patternGuide) {
    expect(patterns.some(({ id }) => id === item.patternId)).toBe(true);
    const lesson = lessons.find(({ id }) => id === item.lessonId);
    expect(lesson?.patterns).toContain(item.patternId);
    expect(references.some(({ patternId }) => patternId === item.patternId)).toBe(true);
    expect(item.useWhen.length).toBeGreaterThan(20);
    expect(item.avoidWhen.length).toBeGreaterThan(20);
    expect(item.example.length).toBeGreaterThan(20);
  }
});
