import { describe, expect, it } from 'vitest';

import { patterns } from '../src/data/patterns';
import { CORE_LESSON_IDS } from '../src/data/progress-ids';
import { referenceTopics } from '../src/data/reference-topics';
import { stages } from '../src/data/stages';
import {
  getReadyLessonIds,
  readLessonDocuments,
  sortLessons,
} from '../src/lib/content';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

describe('curriculum graph', () => {
  it('defines stages 0 through 20 once and in course order', () => {
    expect(stages.map((stage) => stage.id)).toEqual(
      Array.from({ length: 21 }, (_, stage) => stage),
    );
  });

  it('sorts the course from s00-l01 through s20-l02', async () => {
    const sorted = sortLessons(await readLessonDocuments(lessonDirectory));

    expect(sorted).toHaveLength(54);
    expect(sorted[0]?.data.id).toBe('s00-l01');
    expect(sorted.at(-1)?.data.id).toBe('s20-l02');
    expect(sorted.map((lesson) => lesson.data.id)).toEqual([
      's00-l01', 's00-l02', 's00-l03', 's01-l01', 's01-l02',
      's02-l01', 's02-l02', 's02-l03', 's03-l01', 's03-l02',
      's04-l01', 's04-l02', 's05-l01', 's05-l02', 's06-l01',
      's06-l02', 's06-l03', 's07-l01', 's07-l02', 's07-l03',
      's08-l01', 's08-l02', 's08-l03', 's09-l01', 's09-l02',
      's10-l01', 's10-l02', 's10-l03', 's10-l04', 's11-l01',
      's11-l02', 's12-l01', 's12-l02', 's13-l01', 's13-l02',
      's13-l03', 's13-l04', 's13-l05', 's13-l06', 's14-l01',
      's14-l02', 's15-l01', 's15-l02', 's15-l03', 's15-l04',
      's16-l01', 's16-l02', 's17-l01', 's18-l01', 's18-l02',
      's19-l01', 's19-l02', 's20-l01', 's20-l02',
    ]);
    expect(sorted.map((lesson) => lesson.data.id)).toEqual(CORE_LESSON_IDS);
  });

  it('unlocks only lessons whose direct prerequisites are complete', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);

    expect(getReadyLessonIds(lessons, new Set())).toEqual(['s00-l01']);
    expect(getReadyLessonIds(lessons, new Set(['s00-l01']))).toEqual([
      's00-l02',
    ]);
  });

  it('keeps every advanced reference topic outside core progress', async () => {
    const lessonIds = new Set(
      (await readLessonDocuments(lessonDirectory)).map(({ data }) => data.id),
    );

    expect(referenceTopics.length).toBeGreaterThan(0);
    expect(referenceTopics.every((topic) => topic.core === false)).toBe(true);
    expect(
      referenceTopics.every((topic) =>
        topic.prerequisites.every((id) => lessonIds.has(id)),
      ),
    ).toBe(true);
    expect(new Set(referenceTopics.map(({ slug }) => slug)).size).toBe(referenceTopics.length);
    expect(
      referenceTopics.every(
        ({ useWhen, decisionNotes, complexity, pitfalls }) =>
          useWhen.trim().length > 0 &&
          decisionNotes.length >= 3 &&
          complexity.length >= 2 &&
          pitfalls.length >= 3 &&
          [...decisionNotes, ...complexity, ...pitfalls].every((note) => note.trim().length > 0),
      ),
    ).toBe(true);
  });

  it('defines every pattern referenced by a lesson', async () => {
    const patternIds = new Set(patterns.map((pattern) => pattern.id));
    const lessons = await readLessonDocuments(lessonDirectory);

    expect(
      lessons.flatMap(({ data }) => data.patterns).filter((id) => !patternIds.has(id)),
    ).toEqual([]);
  });
});
