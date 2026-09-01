import { describe, expect, it } from 'vitest';

import { CODEWARS_PROVENANCE, codewarsKata } from '../src/data/codewars';
import { VERIFIED_CODEWARS_DELIVERY_METADATA, VERIFIED_CODEWARS_METADATA } from './fixtures/codewars-official';

describe('verified Codewars fluency corpus', () => {
  it('preserves 34 exact official kata tuples with C++ and Python support', () => {
    expect(codewarsKata).toHaveLength(34);
    expect(codewarsKata.map(({ id, title, slug, rank }) => [id, title, slug, rank]))
      .toEqual(VERIFIED_CODEWARS_METADATA);
    expect(codewarsKata.map(({ id, url, supportedLanguages }) => [id, url, supportedLanguages]))
      .toEqual(VERIFIED_CODEWARS_DELIVERY_METADATA);
    expect(new Set(codewarsKata.map(({ id }) => id)).size).toBe(34);
    expect(new Set(codewarsKata.map(({ slug }) => slug)).size).toBe(34);

    for (const kata of codewarsKata) {
      expect(kata.url).toBe(`https://www.codewars.com/kata/${kata.id}`);
      expect(kata.supportedLanguages).toEqual(['cpp', 'python']);
      expect(kata.verifiedAt).toBe('2026-09-01');
      expect(kata.topics.length).toBeGreaterThan(0);
      expect(kata.prerequisiteLessonIds.length).toBeGreaterThan(0);
      expect(kata.learningNoteRu).toMatch(/[А-Яа-яЁё]/);
    }
  });

  it('keeps provider rank separate from AlgoDS tier and scaffolding mode', () => {
    expect(new Set(codewarsKata.map(({ rank }) => rank))).toEqual(
      new Set(['8 kyu', '7 kyu', '6 kyu', '5 kyu', '4 kyu']),
    );
    expect(new Set(codewarsKata.map(({ tier }) => tier)).size).toBe(3);
    expect(new Set(codewarsKata.map(({ practiceMode }) => practiceMode)).size).toBe(3);
    expect(codewarsKata.find(({ slug }) => slug === 'valid-braces')).toMatchObject({
      rank: '6 kyu',
      tier: 'standard',
      practiceMode: 'transfer',
    });
  });

  it('records the public official challenge endpoint used for verification', () => {
    expect(CODEWARS_PROVENANCE).toEqual({
      provider: 'Codewars',
      verifiedAt: '2026-09-01',
      sourceUrl: 'https://www.codewars.com/api/v1/code-challenges/{challenge}',
    });
  });
});
