import { describe, expect, it } from 'vitest';

import { knowledgeMapGroups } from '../src/data/knowledge-map-groups';
import {
  buildKnowledgeMap,
  buildKnowledgeMapGroups,
  deriveKnowledgeMapState,
  getKnowledgeMapStageDetail,
  type KnowledgeMapEdge,
  type KnowledgeMapLesson,
  type KnowledgeMapStage,
} from '../src/lib/knowledge-map';
import { stages as courseStages } from '../src/data/stages';
import { readLessonDocuments } from '../src/lib/content';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

const stages: KnowledgeMapStage[] = [
  { id: 3, slug: 'convergence', title: 'Сведение ветвей', description: 'Объединяем знания.' },
  { id: 1, slug: 'arrays', title: 'Массивы', description: 'Первая ветвь.' },
  { id: 0, slug: 'foundation', title: 'Основа', description: 'Общий фундамент.' },
  { id: 2, slug: 'hashing', title: 'Хеширование', description: 'Вторая ветвь.' },
];

const lessons: KnowledgeMapLesson[] = [
  { id: 's03-l01', slug: 'merge', title: 'Сведение', stage: 3, order: 1, prerequisites: ['s01-l01', 's02-l01'] },
  { id: 's01-l02', slug: 'arrays-two', title: 'Ещё массивы', stage: 1, order: 2, prerequisites: ['s00-l02'] },
  { id: 's00-l02', slug: 'proof', title: 'Доказательство', stage: 0, order: 2, prerequisites: ['s00-l01'] },
  { id: 's02-l01', slug: 'hash', title: 'Хеш', stage: 2, order: 1, prerequisites: ['s00-l02'] },
  { id: 's00-l01', slug: 'budget', title: 'Ограничения', stage: 0, order: 1, prerequisites: [] },
  { id: 's01-l01', slug: 'arrays-one', title: 'Массивы', stage: 1, order: 1, prerequisites: ['s00-l02'] },
];

const reachabilityPairs = (
  stageIds: readonly number[],
  edges: readonly KnowledgeMapEdge[],
): string[] => {
  const outgoing = new Map(stageIds.map((stageId) => [stageId, [] as number[]]));
  edges.forEach(({ fromStageId, toStageId }) => outgoing.get(fromStageId)?.push(toStageId));

  return stageIds.flatMap((fromStageId) => {
    const visited = new Set<number>();
    const queue = [...(outgoing.get(fromStageId) ?? [])];
    while (queue.length > 0) {
      const stageId = queue.shift();
      if (stageId === undefined || visited.has(stageId)) continue;
      visited.add(stageId);
      queue.push(...(outgoing.get(stageId) ?? []));
    }
    return [...visited].sort((a, b) => a - b).map((toStageId) => `${fromStageId}:${toStageId}`);
  });
};

describe('knowledge-map graph', () => {
  it('represents every real course stage and lesson exactly once', async () => {
    const documents = await readLessonDocuments(lessonDirectory);
    const map = buildKnowledgeMap(courseStages, documents.map(({ data }) => data));
    const mappedLessonIds = map.stages.flatMap(({ lessonIds }) => lessonIds);

    expect(map.stages).toHaveLength(21);
    expect(mappedLessonIds).toHaveLength(54);
    expect(new Set(mappedLessonIds).size).toBe(54);
    expect(map.layers.flat().sort((a, b) => a - b)).toEqual(map.stages.map(({ id }) => id));
    expect(new Set(map.edges.map(({ fromStageId, toStageId }) => `${fromStageId}:${toStageId}`)).size)
      .toBe(map.edges.length);
  });

  it('derives deterministic branching stage dependencies from lesson prerequisites', () => {
    const sourceSnapshot = JSON.stringify({ stages, lessons });
    const map = buildKnowledgeMap(stages, lessons);

    expect(map.edges).toEqual([
      { fromStageId: 0, toStageId: 1 },
      { fromStageId: 0, toStageId: 2 },
      { fromStageId: 1, toStageId: 3 },
      { fromStageId: 2, toStageId: 3 },
    ]);
    expect(map.layers).toEqual([[0], [1, 2], [3]]);
    expect(map.stages.map(({ id, lessonIds, prerequisiteStageIds, unlockStageIds, layer }) => ({
      id,
      lessonIds,
      prerequisiteStageIds,
      unlockStageIds,
      layer,
    }))).toEqual([
      { id: 0, lessonIds: ['s00-l01', 's00-l02'], prerequisiteStageIds: [], unlockStageIds: [1, 2], layer: 0 },
      { id: 1, lessonIds: ['s01-l01', 's01-l02'], prerequisiteStageIds: [0], unlockStageIds: [3], layer: 1 },
      { id: 2, lessonIds: ['s02-l01'], prerequisiteStageIds: [0], unlockStageIds: [3], layer: 1 },
      { id: 3, lessonIds: ['s03-l01'], prerequisiteStageIds: [1, 2], unlockStageIds: [], layer: 2 },
    ]);
    expect(JSON.stringify({ stages, lessons })).toBe(sourceSnapshot);
  });

  it('removes only transitively redundant overview edges while preserving exact dependencies', () => {
    const map = buildKnowledgeMap(stages, lessons.map((lesson) =>
      lesson.id === 's03-l01'
        ? { ...lesson, prerequisites: [...lesson.prerequisites, 's00-l02'] }
        : lesson,
    ));
    expect(map.edges).toEqual([
      { fromStageId: 0, toStageId: 1 },
      { fromStageId: 0, toStageId: 2 },
      { fromStageId: 0, toStageId: 3 },
      { fromStageId: 1, toStageId: 3 },
      { fromStageId: 2, toStageId: 3 },
    ]);
    expect(map.overviewEdges).toEqual([
      { fromStageId: 0, toStageId: 1 },
      { fromStageId: 0, toStageId: 2 },
      { fromStageId: 1, toStageId: 3 },
      { fromStageId: 2, toStageId: 3 },
    ]);
    expect(map.stages.find(({ id }) => id === 3)?.prerequisiteStageIds).toEqual([0, 1, 2]);
    expect(reachabilityPairs(map.stages.map(({ id }) => id), map.edges)).toEqual(
      reachabilityPairs(map.stages.map(({ id }) => id), map.overviewEdges),
    );
  });

  it('derives a selected-stage focus path without promoting unrelated branches', () => {
    const map = buildKnowledgeMap(stages, lessons);
    const focus = map.focusByStageId[1];

    expect(focus).toEqual({
      predecessorStageIds: [0],
      unlockStageIds: [3],
      edgeKeys: ['0:1', '1:3'],
    });
  });

  it('keeps the real overview sparse while preserving every course reachability relationship', async () => {
    const documents = await readLessonDocuments(lessonDirectory);
    const map = buildKnowledgeMap(courseStages, documents.map(({ data }) => data));
    const stageIds = map.stages.map(({ id }) => id);

    expect(map.edges).toHaveLength(55);
    expect(map.overviewEdges).toHaveLength(30);
    expect(reachabilityPairs(stageIds, map.overviewEdges)).toEqual(
      reachabilityPairs(stageIds, map.edges),
    );
    expect(map.focusByStageId[13]?.edgeKeys).toEqual(expect.arrayContaining([
      '10:13',
      '11:13',
      '13:16',
    ]));
    expect(map.focusByStageId[13]?.edgeKeys).not.toContain('12:18');
    expect(map.focusByStageId[13]?.unlockStageIds).toEqual([16]);
  });

  it('groups every real course stage exactly once into unique learner-facing areas', async () => {
    const documents = await readLessonDocuments(lessonDirectory);
    const map = buildKnowledgeMap(courseStages, documents.map(({ data }) => data));
    const groups = buildKnowledgeMapGroups(map, knowledgeMapGroups);
    const groupedStageIds = groups.flatMap(({ stages }) => stages.map(({ id }) => id));

    expect(groups).toHaveLength(7);
    expect(new Set(groups.map(({ id }) => id)).size).toBe(groups.length);
    expect(groupedStageIds).toEqual(map.stages.map(({ id }) => id));
    expect(new Set(groupedStageIds).size).toBe(map.stages.length);
  });

  it('exposes exact prerequisite and unlock stages for the selected-stage detail', () => {
    const map = buildKnowledgeMap(stages, lessons);
    const detail = getKnowledgeMapStageDetail(map, 3);

    expect(detail?.prerequisiteStages.map(({ id }) => id)).toEqual([1, 2]);
    expect(detail?.unlockStages).toEqual([]);
    expect(getKnowledgeMapStageDetail(map, 1)?.unlockStages.map(({ id }) => id)).toEqual([3]);
    expect(getKnowledgeMapStageDetail(map, 99)).toBeNull();
  });

  it('distinguishes blocked, ready, in-progress, and completed lesson and stage states', () => {
    const map = buildKnowledgeMap(stages, lessons);
    const active = deriveKnowledgeMapState(map, lessons, {
      's00-l01': 'completed',
      's00-l02': 'in-progress',
    });

    expect(active.lessonStates).toEqual({
      's00-l01': 'completed',
      's00-l02': 'in-progress',
      's01-l01': 'blocked',
      's01-l02': 'blocked',
      's02-l01': 'blocked',
      's03-l01': 'blocked',
    });
    expect(active.stageStates).toEqual({ 0: 'in-progress', 1: 'blocked', 2: 'blocked', 3: 'blocked' });
    expect(active.nextLessonId).toBe('s00-l02');
    expect(active.nextStageId).toBe(0);

    const foundationComplete = deriveKnowledgeMapState(map, lessons, {
      's00-l01': 'completed',
      's00-l02': 'completed',
    });
    expect(foundationComplete.stageStates).toEqual({ 0: 'completed', 1: 'ready', 2: 'ready', 3: 'blocked' });
    expect(foundationComplete.nextLessonId).toBe('s01-l01');
    expect(foundationComplete.nextStageId).toBe(1);
  });

  it('fails closed when a lesson references an unknown lesson or stage', () => {
    expect(() => buildKnowledgeMap(stages, [
      ...lessons,
      { id: 's04-l01', slug: 'unknown-stage', title: 'Неизвестный этап', stage: 4, order: 1, prerequisites: [] },
    ])).toThrow('unknown stage 4');

    expect(() => buildKnowledgeMap(stages, lessons.map((lesson) =>
      lesson.id === 's03-l01' ? { ...lesson, prerequisites: ['missing'] } : lesson,
    ))).toThrow('unknown prerequisite missing');
  });

  it('fails closed when cross-stage prerequisites form a cycle', () => {
    const cyclicStages: KnowledgeMapStage[] = [
      { id: 0, slug: 'zero', title: 'Нулевой', description: 'Первый этап цикла.' },
      { id: 1, slug: 'one', title: 'Первый', description: 'Второй этап цикла.' },
    ];
    const cyclicLessons: KnowledgeMapLesson[] = [
      { id: 's00-l01', slug: 'zero', title: 'Нулевой', stage: 0, order: 1, prerequisites: ['s01-l01'] },
      { id: 's01-l01', slug: 'one', title: 'Первый', stage: 1, order: 1, prerequisites: ['s00-l01'] },
    ];

    expect(() => buildKnowledgeMap(cyclicStages, cyclicLessons)).toThrow(
      'stage dependencies contain a cycle',
    );
  });
});
