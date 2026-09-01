import { describe, expect, it } from 'vitest';

import { practiceTasks } from '../src/data/practice';
import {
  CODERUN_PROGRESS_IDS,
  LEETCODE_75_PROGRESS_IDS,
} from '../src/data/progress-ids';
import {
  assertValidPracticeTasks,
  filterPracticeTasks,
  getPracticeCollection,
  groupLeetCode75Tasks,
  normalizePracticeText,
} from '../src/lib/practice';
import {
  LEGACY_CODERUN_PROGRESS_IDS,
  LEGACY_LEETCODE_75_PROGRESS_IDS,
} from './fixtures/practice-compatibility';

describe('normalized practice domain', () => {
  it('keeps one unique canonical entity per provider task with stable progress IDs', () => {
    expect(practiceTasks).toHaveLength(112);
    expect(() => assertValidPracticeTasks(practiceTasks)).not.toThrow();
    expect(new Set(practiceTasks.map(({ id }) => id)).size).toBe(112);
    expect(practiceTasks.filter(({ provider }) => provider === 'leetcode')).toHaveLength(75);
    expect(practiceTasks.filter(({ provider }) => provider === 'coderun')).toHaveLength(37);
    expect(practiceTasks.every(({ url }) => url.startsWith('https://'))).toBe(true);
    expect(practiceTasks.every(({ verification }) => verification.source === 'official-provider')).toBe(true);
  });

  it('derives LeetCode 75 from collection membership without duplicating task entities', () => {
    const collection = getPracticeCollection(practiceTasks, 'leetcode75');
    const groups = groupLeetCode75Tasks(collection);

    expect(collection).toHaveLength(75);
    expect(collection[0]).toBe(practiceTasks.find(({ id }) => id === 'leetcode:1768'));
    expect(collection.at(-1)?.id).toBe('leetcode:901');
    expect(groups).toHaveLength(22);
    expect(groups.flatMap(({ tasks }) => tasks)).toEqual(collection);
  });

  it('preserves the complete legacy progress IDs and curated order independently', () => {
    expect(LEETCODE_75_PROGRESS_IDS).toEqual(LEGACY_LEETCODE_75_PROGRESS_IDS);
    expect(LEGACY_CODERUN_PROGRESS_IDS.every((id) => CODERUN_PROGRESS_IDS.includes(id)))
      .toBe(true);
    expect(getPracticeCollection(practiceTasks, 'leetcode75').map(({ id }) => id))
      .toEqual(LEGACY_LEETCODE_75_PROGRESS_IDS);
  });

  it('keeps AlgoDS tier independent from scaffolding mode', () => {
    const byId = new Map(practiceTasks.map((task) => [task.id, task]));

    expect(byId.get('leetcode:1071')).toMatchObject({ tier: 'warm-up', mode: 'transfer' });
    expect(byId.get('coderun:1')).toMatchObject({ tier: 'warm-up', mode: 'guided' });
    expect(byId.get('coderun:15')).toMatchObject({ tier: 'stretch', mode: 'independent' });
    expect(byId.get('leetcode:1143')).toMatchObject({ tier: 'stretch', mode: 'guided' });
    expect(byId.get('leetcode:72')).toMatchObject({ tier: 'stretch', mode: 'independent' });
  });

  it('combines provider, stage, readiness, tier, mode, status, and revisit filters', () => {
    const completedLessonIds = new Set(['s13-l02']);
    const ready = filterPracticeTasks(practiceTasks, {
      provider: 'coderun',
      topic: 'Компоненты связности',
      stage: 13,
      readiness: 'ready',
      tier: 'standard',
      mode: 'transfer',
      status: 'not-started',
    }, { completedLessonIds, statuses: {} });

    expect(ready.map(({ id }) => id)).toEqual(['coderun:8']);

    const revisit = filterPracticeTasks(practiceTasks, {
      provider: 'coderun',
      revisit: true,
    }, {
      completedLessonIds,
      statuses: { 'coderun:8': 'revisit' },
    });
    expect(revisit.map(({ id }) => id)).toEqual(['coderun:8']);
  });

  it('filters by normalized topic and rejects duplicate IDs', () => {
    expect(normalizePracticeText('Ещё один раз')).toBe('еще один раз');
    expect(filterPracticeTasks(practiceTasks, { topic: 'Компоненты связности' }, {
      completedLessonIds: new Set(),
      statuses: {},
    }).map(({ id }) => id)).toContain('coderun:8');

    expect(() => assertValidPracticeTasks([
      practiceTasks[0]!,
      practiceTasks[0]!,
    ])).toThrow('duplicate practice task id');
  });
});
