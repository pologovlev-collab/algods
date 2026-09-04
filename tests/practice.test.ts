import { describe, expect, it } from 'vitest';

import { practiceTasks } from '../src/data/practice';
import {
  CODERUN_PROGRESS_IDS,
  KNOWN_PROBLEM_ID_SET,
  LEETCODE_75_PROGRESS_IDS,
} from '../src/data/progress-ids';
import { patterns } from '../src/data/patterns';
import { readLessonDocuments } from '../src/lib/content';
import { orderCourseLessons } from '../src/lib/course';
import {
  assertValidPracticeTasks,
  filterPracticeTasks,
  getPracticeCollection,
  groupLeetCode75Tasks,
  normalizePracticeText,
  orderPracticeTasks,
  selectLessonPracticeTasks,
} from '../src/lib/practice';
import {
  LEGACY_CODERUN_PROGRESS_IDS,
  LEGACY_LEETCODE_75_PROGRESS_IDS,
} from './fixtures/practice-compatibility';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

describe('normalized practice domain', () => {
  it('keeps one unique canonical entity per provider task with stable progress IDs', () => {
    expect(practiceTasks).toHaveLength(146);
    expect(() => assertValidPracticeTasks(practiceTasks)).not.toThrow();
    expect(new Set(practiceTasks.map(({ id }) => id)).size).toBe(146);
    expect(practiceTasks.filter(({ provider }) => provider === 'leetcode')).toHaveLength(75);
    expect(practiceTasks.filter(({ provider }) => provider === 'coderun')).toHaveLength(37);
    expect(practiceTasks.filter(({ provider }) => provider === 'codewars')).toHaveLength(34);
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

  it('orders each stage from warm-up to stretch and from guided to independent within a tier', () => {
    const tierRank = { 'warm-up': 0, standard: 1, stretch: 2 } as const;
    const modeRank = { guided: 0, transfer: 1, independent: 2 } as const;
    const ordered = orderPracticeTasks(practiceTasks);

    for (let index = 1; index < ordered.length; index += 1) {
      const previous = ordered[index - 1]!;
      const current = ordered[index]!;
      expect(previous.stage).toBeLessThanOrEqual(current.stage);
      if (previous.stage !== current.stage) continue;
      expect(tierRank[previous.tier]).toBeLessThanOrEqual(tierRank[current.tier]);
      if (previous.tier === current.tier) {
        expect(modeRank[previous.mode]).toBeLessThanOrEqual(modeRank[current.mode]);
      }
    }
  });

  it('keeps every algorithm-teaching stage covered by scaffolded and less-scaffolded practice', () => {
    for (let stage = 2; stage <= 18; stage += 1) {
      const stageTasks = practiceTasks.filter((task) => task.stage === stage);
      expect(stageTasks.length, `stage ${stage}`).toBeGreaterThanOrEqual(2);
      expect(stageTasks.some(({ mode }) => mode === 'guided'), `stage ${stage} guided`).toBe(true);
      expect(stageTasks.some(({ mode }) => mode !== 'guided'), `stage ${stage} transfer`).toBe(true);
    }

    expect(practiceTasks.every((task) => task.prerequisiteLessonIds.every((id) => (
      Number(id.slice(1, 3)) <= task.stage
    )))).toBe(true);
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

  it('selects a deterministic, relevant six-task lesson bridge with available diversity', async () => {
    const lessons = orderCourseLessons(
      (await readLessonDocuments(lessonDirectory)).map(({ data }) => data),
    );
    const lesson = lessons.find(({ id }) => id === 's06-l01')!;
    const lessonTopics = patterns
      .filter(({ id }) => lesson.patterns.includes(id))
      .map(({ title }) => title);
    const options = {
      lessonId: lesson.id,
      lessonStage: lesson.stage,
      lessonTopics,
      orderedLessons: lessons,
    };

    const selected = selectLessonPracticeTasks(practiceTasks, options);
    const reversed = selectLessonPracticeTasks([...practiceTasks].reverse(), options);

    expect(selected).toHaveLength(6);
    expect(selected.map(({ id }) => id)).toEqual(reversed.map(({ id }) => id));
    expect(new Set(selected.map(({ id }) => id)).size).toBe(selected.length);
    expect(new Set(selected.map(({ provider }) => provider))).toEqual(
      new Set(['leetcode', 'coderun', 'codewars']),
    );
    expect(new Set(selected.map(({ mode }) => mode))).toEqual(
      new Set(['guided', 'transfer', 'independent']),
    );
    expect(selected.every(({ id }) => KNOWN_PROBLEM_ID_SET.has(id))).toBe(true);
    expect(selected.every(({ prerequisiteLessonIds }) => (
      prerequisiteLessonIds.includes(lesson.id)
    ))).toBe(true);
  });
});
