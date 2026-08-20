import { describe, expect, it } from 'vitest';

import { filterSearchEntries } from '../src/lib/search';

const entries = [
  { href: '/course/binary-search/', title: 'Бинарный поиск', context: 'Этап 8 · Границы и инвариант' },
  { href: '/reference/', title: 'Продвинутые алгоритмы на графах', context: 'Справочник' },
  { href: '/practice/', title: 'Практика', context: 'Задачи LeetCode 75 и CodeRun' },
];

describe('global search', () => {
  it('matches every normalized query token across title and context', () => {
    expect(filterSearchEntries(entries, '  БИНАРНЫЙ   инвариант ')).toEqual([entries[0]]);
    expect(filterSearchEntries(entries, 'графах справочник')).toEqual([entries[1]]);
  });

  it('normalizes е/ё, returns no results for an empty query and respects a limit', () => {
    const variants = [
      ...entries,
      { href: '/course/', title: 'Перебор', context: 'Ещё один урок' },
    ];

    expect(filterSearchEntries(variants, 'еще')).toEqual([variants[3]]);
    expect(filterSearchEntries(entries, '')).toEqual([]);
    expect(filterSearchEntries(entries, 'и', 1)).toHaveLength(1);
  });
});
