export interface KnowledgeMapStage {
  id: number;
  slug: string;
  title: string;
  description: string;
}

export interface KnowledgeMapLesson {
  id: string;
  slug: string;
  title: string;
  stage: number;
  order: number;
  prerequisites: string[];
  summary?: string;
}

export interface KnowledgeMapEdge {
  fromStageId: number;
  toStageId: number;
}

export interface KnowledgeMapStageNode extends KnowledgeMapStage {
  lessonIds: string[];
  prerequisiteStageIds: number[];
  unlockStageIds: number[];
  layer: number;
}

export interface KnowledgeMapFocus {
  predecessorStageIds: number[];
  unlockStageIds: number[];
  edgeKeys: string[];
}

export interface KnowledgeMapModel {
  stages: KnowledgeMapStageNode[];
  edges: KnowledgeMapEdge[];
  overviewEdges: KnowledgeMapEdge[];
  focusByStageId: Record<number, KnowledgeMapFocus>;
  layers: number[][];
}

export type KnowledgeLessonState = 'blocked' | 'ready' | 'in-progress' | 'completed';
export type KnowledgeStageState = KnowledgeLessonState;
export type StoredLessonStatus = 'in-progress' | 'completed';

export interface KnowledgeMapState {
  lessonStates: Record<string, KnowledgeLessonState>;
  stageStates: Record<number, KnowledgeStageState>;
  nextLessonId: string | null;
}

const orderLessons = <T extends KnowledgeMapLesson>(lessons: readonly T[]): T[] =>
  [...lessons].sort(
    (left, right) =>
      left.stage - right.stage ||
      left.order - right.order ||
      left.id.localeCompare(right.id),
  );

const edgeKey = ({ fromStageId, toStageId }: KnowledgeMapEdge): string =>
  `${fromStageId}:${toStageId}`;

const reachableStageIds = (
  edges: readonly KnowledgeMapEdge[],
  startStageId: number,
  direction: 'forward' | 'backward',
  skippedEdgeKey?: string,
): Set<number> => {
  const reached = new Set<number>();
  const queue = [startStageId];

  while (queue.length > 0) {
    const currentStageId = queue.shift();
    if (currentStageId === undefined) continue;
    for (const edge of edges) {
      if (edgeKey(edge) === skippedEdgeKey) continue;
      const matches = direction === 'forward'
        ? edge.fromStageId === currentStageId
        : edge.toStageId === currentStageId;
      if (!matches) continue;
      const nextStageId = direction === 'forward' ? edge.toStageId : edge.fromStageId;
      if (reached.has(nextStageId)) continue;
      reached.add(nextStageId);
      queue.push(nextStageId);
    }
  }

  return reached;
};

const buildOverviewEdges = (edges: readonly KnowledgeMapEdge[]): KnowledgeMapEdge[] =>
  edges.filter((edge) => !reachableStageIds(
    edges,
    edge.fromStageId,
    'forward',
    edgeKey(edge),
  ).has(edge.toStageId));

const buildFocusByStageId = (
  stageIds: readonly number[],
  overviewEdges: readonly KnowledgeMapEdge[],
): Record<number, KnowledgeMapFocus> => Object.fromEntries(stageIds.map((stageId) => {
  const predecessorStageIds = [...reachableStageIds(overviewEdges, stageId, 'backward')]
    .sort((a, b) => a - b);
  const predecessorPathStageIds = new Set([...predecessorStageIds, stageId]);
  const unlockStageIds = overviewEdges
    .filter(({ fromStageId }) => fromStageId === stageId)
    .map(({ toStageId }) => toStageId)
    .sort((a, b) => a - b);
  const edgeKeys = overviewEdges
    .filter((edge) => (
      predecessorPathStageIds.has(edge.fromStageId) &&
      predecessorPathStageIds.has(edge.toStageId)
    ) || edge.fromStageId === stageId)
    .map(edgeKey);

  return [stageId, { predecessorStageIds, unlockStageIds, edgeKeys }];
}));

export function buildKnowledgeMap(
  sourceStages: readonly KnowledgeMapStage[],
  sourceLessons: readonly KnowledgeMapLesson[],
): KnowledgeMapModel {
  const stages = [...sourceStages].sort((left, right) => left.id - right.id);
  const stageById = new Map<number, KnowledgeMapStage>();
  for (const stage of stages) {
    if (stageById.has(stage.id)) throw new Error(`Knowledge map has duplicate stage ${stage.id}.`);
    stageById.set(stage.id, stage);
  }

  const lessons = orderLessons(sourceLessons);
  const lessonById = new Map<string, KnowledgeMapLesson>();
  for (const lesson of lessons) {
    if (!stageById.has(lesson.stage)) {
      throw new Error(`Knowledge-map lesson ${lesson.id} references unknown stage ${lesson.stage}.`);
    }
    if (lessonById.has(lesson.id)) {
      throw new Error(`Knowledge map has duplicate lesson ${lesson.id}.`);
    }
    lessonById.set(lesson.id, lesson);
  }

  const prerequisiteStageIds = new Map<number, Set<number>>(
    stages.map(({ id }) => [id, new Set<number>()]),
  );
  const unlockStageIds = new Map<number, Set<number>>(
    stages.map(({ id }) => [id, new Set<number>()]),
  );
  const edgeKeys = new Set<string>();

  for (const lesson of lessons) {
    for (const prerequisiteId of lesson.prerequisites) {
      const prerequisite = lessonById.get(prerequisiteId);
      if (!prerequisite) {
        throw new Error(`Knowledge-map lesson ${lesson.id} references unknown prerequisite ${prerequisiteId}.`);
      }
      if (prerequisite.stage === lesson.stage) continue;

      const edgeKey = `${prerequisite.stage}:${lesson.stage}`;
      if (edgeKeys.has(edgeKey)) continue;
      edgeKeys.add(edgeKey);
      prerequisiteStageIds.get(lesson.stage)?.add(prerequisite.stage);
      unlockStageIds.get(prerequisite.stage)?.add(lesson.stage);
    }
  }

  const edges = [...edgeKeys]
    .map((key) => {
      const [fromStageId, toStageId] = key.split(':').map(Number);
      return { fromStageId: fromStageId ?? 0, toStageId: toStageId ?? 0 };
    })
    .sort(
      (left, right) =>
        left.fromStageId - right.fromStageId || left.toStageId - right.toStageId,
    );

  const layerByStageId = new Map<number, number>();
  const visiting = new Set<number>();
  const getLayer = (stageId: number): number => {
    const cached = layerByStageId.get(stageId);
    if (cached !== undefined) return cached;
    if (visiting.has(stageId)) throw new Error(`Knowledge-map stage dependencies contain a cycle at ${stageId}.`);

    visiting.add(stageId);
    const prerequisites = [...(prerequisiteStageIds.get(stageId) ?? [])];
    const layer = prerequisites.length === 0
      ? 0
      : Math.max(...prerequisites.map((prerequisiteId) => getLayer(prerequisiteId))) + 1;
    visiting.delete(stageId);
    layerByStageId.set(stageId, layer);
    return layer;
  };

  const nodes = stages.map((stage) => ({
    ...stage,
    lessonIds: lessons.filter((lesson) => lesson.stage === stage.id).map(({ id }) => id),
    prerequisiteStageIds: [...(prerequisiteStageIds.get(stage.id) ?? [])].sort((a, b) => a - b),
    unlockStageIds: [...(unlockStageIds.get(stage.id) ?? [])].sort((a, b) => a - b),
    layer: getLayer(stage.id),
  }));

  const layerCount = Math.max(0, ...nodes.map(({ layer }) => layer)) + 1;
  const layers = Array.from({ length: layerCount }, () => [] as number[]);
  for (const node of nodes) layers[node.layer]?.push(node.id);

  const overviewEdges = buildOverviewEdges(edges);
  const focusByStageId = buildFocusByStageId(nodes.map(({ id }) => id), overviewEdges);

  return { stages: nodes, edges, overviewEdges, focusByStageId, layers };
}

export function deriveKnowledgeMapState(
  map: KnowledgeMapModel,
  sourceLessons: readonly KnowledgeMapLesson[],
  statuses: Readonly<Record<string, StoredLessonStatus | undefined>>,
): KnowledgeMapState {
  const lessons = orderLessons(sourceLessons);
  const completedLessonIds = new Set(
    lessons.filter(({ id }) => statuses[id] === 'completed').map(({ id }) => id),
  );
  const lessonStates: Record<string, KnowledgeLessonState> = {};

  for (const lesson of lessons) {
    lessonStates[lesson.id] = statuses[lesson.id] === 'completed'
      ? 'completed'
      : statuses[lesson.id] === 'in-progress'
        ? 'in-progress'
        : lesson.prerequisites.every((id) => completedLessonIds.has(id))
          ? 'ready'
          : 'blocked';
  }

  const stageStates: Record<number, KnowledgeStageState> = {};
  for (const stage of map.stages) {
    const states = stage.lessonIds.map((id) => lessonStates[id]).filter(Boolean);
    stageStates[stage.id] = states.length > 0 && states.every((state) => state === 'completed')
      ? 'completed'
      : states.some((state) => state === 'in-progress' || state === 'completed')
        ? 'in-progress'
        : states.some((state) => state === 'ready')
          ? 'ready'
          : 'blocked';
  }

  const nextLesson = lessons.find(({ id }) => lessonStates[id] === 'in-progress')
    ?? lessons.find(({ id }) => lessonStates[id] === 'ready');

  return {
    lessonStates,
    stageStates,
    nextLessonId: nextLesson?.id ?? null,
  };
}
