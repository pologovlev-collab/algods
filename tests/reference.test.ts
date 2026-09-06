import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
    expect(entries).toHaveLength(33);
    expect(entries.filter(({ source }) => source === 'core')).toHaveLength(25);
    expect(entries.filter(({ source }) => source === 'advanced')).toHaveLength(referenceTopics.length);
    expect(entries.map(({ href }) => href)).toContain('/reference/binary-search/');
    expect(entries.map(({ href }) => href)).toContain('/reference/dynamic-array/');
    expect(entries.map(({ href }) => href)).toContain('/reference/advanced-graph-algorithms/');
  });

  it('makes dynamic arrays discoverable without confusing Python list with a linked list', async () => {
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const dynamicArray = buildReferenceEntries(lessons).find(({ slug }) => slug === 'dynamic-array');

    expect(dynamicArray).toMatchObject({
      title: 'Динамический массив',
      courseLessonIds: ['s01-l01'],
    });
    expect(dynamicArray?.aliases).toEqual(expect.arrayContaining([
      'dynamic array',
      'std::vector',
      'python list',
      'динамический массив',
    ]));
    expect(dynamicArray?.pitfalls.join(' ')).toMatch(/Python list.*не связн/i);
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

  it('exposes structured advanced guides for range trees, balanced trees, and binary lifting', async () => {
    type DeepDiveEntry = {
      deepDives?: Array<{
        id: string;
        mentalModel: string;
        mechanics: string[];
        chooseWhen: string[];
      }>;
    };
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const entries = buildReferenceEntries(lessons);
    const rangeTrees = entries.find(({ slug }) => slug === 'range-query-trees') as DeepDiveEntry | undefined;
    const treeQueries = entries.find(({ slug }) => slug === 'lca-and-balanced-trees') as DeepDiveEntry | undefined;

    expect(rangeTrees?.deepDives?.map(({ id }) => id)).toEqual([
      'fenwick-tree',
      'segment-tree',
      'range-query-selection',
    ]);
    expect(treeQueries?.deepDives?.map(({ id }) => id)).toEqual([
      'balanced-search-trees',
      'binary-lifting',
    ]);

    for (const deepDive of [...(rangeTrees?.deepDives ?? []), ...(treeQueries?.deepDives ?? [])]) {
      expect(deepDive.mentalModel.length).toBeGreaterThan(40);
      expect(deepDive.mechanics.length).toBeGreaterThan(1);
      expect(deepDive.chooseWhen.length).toBeGreaterThan(0);
    }
  });

  it('ships executable C++17 and Python implementations for the advanced structures that need code', async () => {
    type CodeExample = {
      language: 'cpp' | 'python';
      code: string;
    };
    type DeepDiveEntry = {
      slug: string;
      deepDives?: Array<{ id: string; codeExamples?: CodeExample[] }>;
    };
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const entries = buildReferenceEntries(lessons) as DeepDiveEntry[];
    const implementations = entries.flatMap((entry) => (entry.deepDives ?? []).flatMap((deepDive) =>
      (deepDive.codeExamples ?? []).map((example) => ({
        ...example,
        id: `${entry.slug}/${deepDive.id}/${example.language}`,
      })),
    ));

    expect(implementations.map(({ id }) => id)).toEqual([
      'range-query-trees/fenwick-tree/cpp',
      'range-query-trees/fenwick-tree/python',
      'range-query-trees/segment-tree/cpp',
      'range-query-trees/segment-tree/python',
      'lca-and-balanced-trees/binary-lifting/cpp',
      'lca-and-balanced-trees/binary-lifting/python',
    ]);
    const expectedOutputById = new Map([
      ['range-query-trees/fenwick-tree/cpp', '0\n12\n4\n10'],
      ['range-query-trees/fenwick-tree/python', '0\n12\n4\n10'],
      ['range-query-trees/segment-tree/cpp', '0\n15\n13\n16'],
      ['range-query-trees/segment-tree/python', '0\n15\n13\n16'],
      ['lca-and-balanced-trees/binary-lifting/cpp', '1\n0\n0\n6'],
      ['lca-and-balanced-trees/binary-lifting/python', '1\n0\n0\n6'],
    ]);

    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'algods-reference-code-'));
    try {
      for (const example of implementations) {
        const expectedOutput = expectedOutputById.get(example.id);
        expect(expectedOutput).toBeDefined();
        const safeId = example.id.replaceAll('/', '-');
        const sourcePath = join(temporaryDirectory, `${safeId}.${example.language === 'cpp' ? 'cpp' : 'py'}`);
        writeFileSync(sourcePath, example.code, 'utf8');

        if (example.language === 'cpp') {
          const executablePath = join(temporaryDirectory, `${safeId}.exe`);
          const compile = spawnSync('g++', [
            '-std=c++17',
            '-Wall',
            '-Wextra',
            '-pedantic',
            sourcePath,
            '-o',
            executablePath,
          ], { encoding: 'utf8' });
          expect(compile.status, `${example.id}: ${compile.stderr || compile.error?.message}`).toBe(0);
          const run = spawnSync(executablePath, [], { encoding: 'utf8', timeout: 5000 });
          expect(run.status, `${example.id}: ${run.stderr || run.error?.message}`).toBe(0);
          expect(run.stdout.replaceAll('\r\n', '\n').trim()).toBe(expectedOutput);
        } else {
          const run = spawnSync('python', [sourcePath], { encoding: 'utf8', timeout: 5000 });
          expect(run.status, `${example.id}: ${run.stderr || run.error?.message}`).toBe(0);
          expect(run.stdout.replaceAll('\r\n', '\n').trim()).toBe(expectedOutput);
        }
      }
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  }, 30_000);
});
