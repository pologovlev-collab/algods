import { describe, expect, it } from 'vitest';

import { practiceTasks } from '../src/data/practice';
import { stages } from '../src/data/stages';
import { readLessonDocuments } from '../src/lib/content';
import { buildReferenceEntries } from '../src/lib/reference';
import { buildSearchIndex } from '../src/lib/search-index';
import { rankSearchEntries, type SearchEntry } from '../src/lib/search';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

const rankingEntries: SearchEntry[] = [
  {
    id: 'reference:binary-search',
    type: 'reference',
    href: '/reference/binary-search/',
    title: 'Бинарный поиск',
    aliases: ['binary search', 'двоичный поиск'],
    topics: ['монотонная граница'],
    context: 'Справочник · границы и сложность',
    sourceOrder: 0,
  },
  {
    id: 'lesson:binary-search-invariant',
    type: 'lesson',
    href: '/course/binary-search-invariant/',
    title: 'Точный бинарный поиск через инвариант',
    aliases: ['lower bound'],
    topics: ['binary search', 'границы', 'инвариант'],
    context: 'Этап 8 · урок курса',
    sourceOrder: 1,
  },
  {
    id: 'practice:search-insert-position',
    type: 'practice',
    href: 'https://leetcode.com/problems/search-insert-position/',
    title: 'Search Insert Position',
    aliases: ['LeetCode', 'binary search'],
    topics: ['практика бинарного поиска'],
    context: 'Практика · Medium',
    sourceOrder: 2,
  },
];

describe('global search ranking', () => {
  it('ranks exact titles and aliases before topic matches and practice metadata', () => {
    expect(rankSearchEntries(rankingEntries, 'binary search').map(({ id }) => id)).toEqual([
      'reference:binary-search',
      'practice:search-insert-position',
      'lesson:binary-search-invariant',
    ]);
    expect(rankSearchEntries(rankingEntries, 'Search Insert Position')[0]?.id).toBe(
      'practice:search-insert-position',
    );
  });

  it('normalizes case, whitespace, and е/ё while keeping empty queries empty', () => {
    const variants: SearchEntry[] = [
      ...rankingEntries,
      {
        id: 'lesson:more',
        type: 'lesson',
        href: '/course/more/',
        title: 'Ещё один разбор',
        aliases: ['more'],
        topics: ['перебор'],
        context: 'Урок',
        sourceOrder: 3,
      },
    ];

    expect(rankSearchEntries(variants, '  БИНАРНЫЙ   поиск ')[0]?.id).toBe('reference:binary-search');
    expect(rankSearchEntries(variants, 'еще')[0]?.id).toBe('lesson:more');
    expect(rankSearchEntries(variants, '')).toEqual([]);
    expect(rankSearchEntries(variants, 'поиск', 1)).toHaveLength(1);
  });
});

describe('global search index', () => {
  it('normalizes every required source into unique typed results with valid links', async () => {
    const lessons = (await readLessonDocuments(lessonDirectory)).map(({ data }) => data);
    const references = buildReferenceEntries(lessons);
    const entries = buildSearchIndex({
      lessons,
      stages,
      references,
      practiceTasks,
    });

    expect(entries).toHaveLength(258);
    expect(new Set(entries.map(({ id }) => id)).size).toBe(entries.length);
    expect(entries.filter(({ type }) => type === 'section')).toHaveLength(5);
    expect(entries.filter(({ type }) => type === 'stage')).toHaveLength(21);
    expect(entries.filter(({ type }) => type === 'lesson')).toHaveLength(54);
    expect(entries.filter(({ type }) => type === 'reference')).toHaveLength(32);
    expect(entries.filter(({ type }) => type === 'practice')).toHaveLength(146);

    entries.forEach((entry, index) => {
      expect(entry.sourceOrder).toBe(index);
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.aliases.length).toBeGreaterThan(0);
      expect(entry.topics.length).toBeGreaterThan(0);
      expect(entry.href.startsWith('/') || entry.href.startsWith('https://')).toBe(true);
    });

    expect(rankSearchEntries(entries, 'binary search')[0]).toMatchObject({
      id: 'reference:binary-search',
      href: '/reference/binary-search/',
      type: 'reference',
    });
    expect(rankSearchEntries(entries, 'Merge Strings Alternately')[0]).toMatchObject({
      id: 'practice:leetcode:1768',
      type: 'practice',
    });
    expect(rankSearchEntries(entries, 'Радио Байтик')[0]).toMatchObject({
      id: 'practice:coderun:40',
      type: 'practice',
    });
    expect(rankSearchEntries(entries, 'CodeRun').some(({ id }) => id.startsWith('practice:coderun:')))
      .toBe(true);
    expect(rankSearchEntries(entries, 'Valid Braces')[0]).toMatchObject({
      id: 'practice:codewars:5277c8a221e209d3f6000b56',
      type: 'practice',
    });
    expect(rankSearchEntries(entries, 'Codewars').some(({ id }) => id.startsWith('practice:codewars:')))
      .toBe(true);
  });
});
