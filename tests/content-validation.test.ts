import { describe, expect, it } from 'vitest';

import { readLessonDocuments, sortLessons } from '../src/lib/content';
import {
  validateCurriculum,
  validateLessonDocument,
} from '../src/lib/validation';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

describe('core lesson content contract', () => {
  it('ships exactly 54 reviewable lessons across all 21 stages', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);

    expect(lessons).toHaveLength(54);
    expect(new Set(lessons.map((lesson) => lesson.data.stage))).toEqual(
      new Set(Array.from({ length: 21 }, (_, stage) => stage)),
    );
    expect(lessons.every((lesson) => lesson.data.core)).toBe(true);
  });

  it('rejects missing reasoning sections, practice, or language parity', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);
    const issues = lessons.flatMap(validateLessonDocument);

    expect(issues).toEqual([]);
  });

  it('allows an appropriate ordered subset of semantic markers while keeping the core contract', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);
    const lesson = lessons[0];
    expect(lesson).toBeDefined();
    if (!lesson) return;

    const withoutOptionalBruteForce = {
      ...lesson,
      body: lesson.body.replace(
        /<!-- algods:brute-force -->[\s\S]*?(?=<!-- algods:bottleneck -->)/,
        '',
      ),
    };
    const missingCoreMarker = {
      ...lesson,
      body: lesson.body.replace('<!-- algods:key-observation -->', ''),
    };
    const genericHeading = {
      ...lesson,
      body: lesson.body.replace(/^## .+$/m, '## Форма задачи'),
    };

    expect(validateLessonDocument(withoutOptionalBruteForce)).toEqual([]);
    expect(validateLessonDocument(missingCoreMarker)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'body.markers', message: expect.stringContaining('key-observation') }),
      ]),
    );
    expect(validateLessonDocument(genericHeading)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'body.headings', message: expect.stringContaining('generic') }),
      ]),
    );

    const conceptualLesson = lessons.find(({ data }) => data.id === 's00-l01');
    expect(conceptualLesson?.body).not.toContain('<!-- algods:implementation -->');
    expect(conceptualLesson?.body).not.toContain('```cpp');
    expect(conceptualLesson && validateLessonDocument(conceptualLesson)).toEqual([]);
  });

  it('checks executable assertions and exact independent-practice metadata', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);
    const lesson = lessons.find(({ data }) => data.practice.independentExercises > 0);
    expect(lesson).toBeDefined();
    if (!lesson) return;

    const withoutCppAssertions = {
      ...lesson,
      body: lesson.body.replace(/assert\([^;\n]+\);/g, ''),
    };
    const withoutIndependentTask = {
      ...lesson,
      body: lesson.body.replace(/^### Задача 1\s*$/m, '### Самостоятельный разбор'),
    };

    expect(validateLessonDocument(withoutCppAssertions)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'code.cpp' })]),
    );
    expect(validateLessonDocument(withoutIndependentTask)).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'practice.independentExercises' })]),
    );
  });

  it('has unique IDs and slugs, valid prerequisites, and no cycles', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);

    expect(validateCurriculum(lessons)).toEqual([]);
  });

  it('rejects a prerequisite that appears later in the linear course', async () => {
    const lessons = sortLessons(await readLessonDocuments(lessonDirectory));
    const first = lessons[0];
    const second = lessons[1];
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (!first || !second) return;

    const invalidFirst = {
      ...first,
      data: { ...first.data, prerequisites: [second.data.id] },
    };
    const issues = validateCurriculum([invalidFirst, second]);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'prerequisites',
          message: expect.stringContaining('must precede'),
        }),
      ]),
    );
  });
});
