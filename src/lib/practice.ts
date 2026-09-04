import {
  getPracticeAnchorLessonId,
  type CourseLessonSummary,
} from './course';

export type PracticeProviderId = 'leetcode' | 'coderun' | 'codewars';
export type PracticeMode = 'guided' | 'transfer' | 'independent';
export type PracticeTier = 'warm-up' | 'standard' | 'stretch';
export type PracticeReadiness = 'ready' | 'blocked';
export type PracticeCollectionId = 'leetcode75';
export type SavedPracticeStatus =
  | 'not-started'
  | 'solved-independent'
  | 'solved-with-help'
  | 'revisit';

export interface PracticeCollectionMembership {
  id: PracticeCollectionId;
  order: number;
  group: string;
  groupOrder: number;
  orderInGroup: number;
}

export interface PracticeTask {
  id: string;
  provider: PracticeProviderId;
  providerTaskId: string;
  providerSlug: string;
  title: string;
  url: string;
  nativeLevel: {
    system: 'difficulty' | 'rank';
    label: string;
  } | null;
  tier: PracticeTier;
  stage: number;
  prerequisiteLessonIds: string[];
  topics: string[];
  mode: PracticeMode;
  collections: PracticeCollectionMembership[];
  noteRu: string;
  verification: {
    verifiedAt: string;
    source: 'official-provider';
  };
}

export interface PracticeFilters {
  query?: string;
  provider?: PracticeProviderId;
  topic?: string;
  stage?: number;
  readiness?: PracticeReadiness;
  tier?: PracticeTier;
  status?: SavedPracticeStatus;
  revisit?: boolean;
  mode?: PracticeMode;
}

export interface PracticeFilterContext {
  completedLessonIds: ReadonlySet<string>;
  statuses: Readonly<Record<string, SavedPracticeStatus | undefined>>;
}

export interface LessonPracticeSelectionOptions {
  lessonId: string;
  lessonStage: number;
  lessonTopics: readonly string[];
  orderedLessons: readonly CourseLessonSummary[];
  maxTasks?: number;
}

const practiceTierRank: Record<PracticeTier, number> = {
  'warm-up': 0,
  standard: 1,
  stretch: 2,
};

const practiceModeRank: Record<PracticeMode, number> = {
  guided: 0,
  transfer: 1,
  independent: 2,
};

const practiceProviders: readonly PracticeProviderId[] = ['leetcode', 'coderun', 'codewars'];
const practiceModes: readonly PracticeMode[] = ['guided', 'transfer', 'independent'];

export const normalizePracticeText = (value: string): string =>
  value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();

export function orderPracticeTasks(tasks: readonly PracticeTask[]): PracticeTask[] {
  return [...tasks].sort((left, right) =>
    left.stage - right.stage
    || practiceTierRank[left.tier] - practiceTierRank[right.tier]
    || practiceModeRank[left.mode] - practiceModeRank[right.mode]
    || left.provider.localeCompare(right.provider)
    || left.id.localeCompare(right.id));
}

export function selectLessonPracticeTasks(
  tasks: readonly PracticeTask[],
  {
    lessonId,
    lessonStage,
    lessonTopics,
    orderedLessons,
    maxTasks = 6,
  }: Readonly<LessonPracticeSelectionOptions>,
): PracticeTask[] {
  const limit = Math.max(0, Math.floor(maxTasks));
  if (limit === 0) return [];

  const normalizedLessonTopics = new Set(lessonTopics.map(normalizePracticeText));
  const uniqueCandidates = new Map<string, PracticeTask>();

  for (const task of tasks) {
    if (uniqueCandidates.has(task.id)) continue;
    if (getPracticeAnchorLessonId(task.prerequisiteLessonIds, orderedLessons) !== lessonId) continue;
    uniqueCandidates.set(task.id, task);
  }

  const relevanceScore = (task: PracticeTask): number => task.topics.reduce(
    (score, topic) => score + (normalizedLessonTopics.has(normalizePracticeText(topic)) ? 1 : 0),
    0,
  );
  const compareCandidates = (left: PracticeTask, right: PracticeTask): number =>
    relevanceScore(right) - relevanceScore(left)
    || Math.abs(left.stage - lessonStage) - Math.abs(right.stage - lessonStage)
    || practiceTierRank[left.tier] - practiceTierRank[right.tier]
    || practiceModeRank[left.mode] - practiceModeRank[right.mode]
    || left.title.localeCompare(right.title, 'ru')
    || left.id.localeCompare(right.id);
  const ranked = [...uniqueCandidates.values()].sort(compareCandidates);
  const selected: PracticeTask[] = [];
  const selectedIds = new Set<string>();
  const selectedProviders = new Set<PracticeProviderId>();

  const addFirst = (predicate: (task: PracticeTask) => boolean): boolean => {
    if (selected.length >= limit) return false;
    const candidate = ranked.find((task) => !selectedIds.has(task.id) && predicate(task));
    if (!candidate) return false;
    selected.push(candidate);
    selectedIds.add(candidate.id);
    selectedProviders.add(candidate.provider);
    return true;
  };

  for (const mode of practiceModes) {
    if (!addFirst((task) => task.mode === mode && !selectedProviders.has(task.provider))) {
      addFirst((task) => task.mode === mode);
    }
  }

  for (const provider of practiceProviders) {
    addFirst((task) => task.provider === provider);
  }

  for (const task of ranked) {
    if (selected.length >= limit) break;
    if (!selectedIds.has(task.id)) {
      selected.push(task);
      selectedIds.add(task.id);
    }
  }

  return selected.sort((left, right) =>
    practiceModeRank[left.mode] - practiceModeRank[right.mode]
    || compareCandidates(left, right));
}

export function getPracticeReadiness(
  task: PracticeTask,
  completedLessonIds: ReadonlySet<string>,
): PracticeReadiness {
  return task.prerequisiteLessonIds.every((id) => completedLessonIds.has(id))
    ? 'ready'
    : 'blocked';
}

export function filterPracticeTasks(
  tasks: readonly PracticeTask[],
  filters: Readonly<PracticeFilters>,
  context: PracticeFilterContext,
): PracticeTask[] {
  const query = normalizePracticeText(filters.query ?? '');
  const topic = filters.topic ? normalizePracticeText(filters.topic) : undefined;

  return tasks.filter((task) => {
    const status = context.statuses[task.id] ?? 'not-started';
    const searchText = normalizePracticeText([
      task.providerTaskId,
      task.providerSlug,
      task.title,
      ...task.topics,
      task.noteRu,
    ].join(' '));

    return (!query || searchText.includes(query))
      && (!filters.provider || task.provider === filters.provider)
      && (!topic || task.topics.some((value) => normalizePracticeText(value) === topic))
      && (filters.stage === undefined || task.stage === filters.stage)
      && (!filters.readiness || getPracticeReadiness(task, context.completedLessonIds) === filters.readiness)
      && (!filters.tier || task.tier === filters.tier)
      && (!filters.status || status === filters.status)
      && (!filters.revisit || status === 'revisit')
      && (!filters.mode || task.mode === filters.mode);
  });
}

export function getPracticeCollection(
  tasks: readonly PracticeTask[],
  collectionId: PracticeCollectionId,
): PracticeTask[] {
  return tasks
    .filter((task) => task.collections.some(({ id }) => id === collectionId))
    .sort((left, right) => {
      const leftOrder = left.collections.find(({ id }) => id === collectionId)?.order ?? 0;
      const rightOrder = right.collections.find(({ id }) => id === collectionId)?.order ?? 0;
      return leftOrder - rightOrder || left.id.localeCompare(right.id);
    });
}

export function groupLeetCode75Tasks(
  tasks: readonly PracticeTask[],
): Array<{ name: string; order: number; tasks: PracticeTask[] }> {
  const groups = new Map<string, { name: string; order: number; tasks: PracticeTask[] }>();
  for (const task of tasks) {
    const membership = task.collections.find(({ id }) => id === 'leetcode75');
    if (!membership) continue;
    const group = groups.get(membership.group) ?? {
      name: membership.group,
      order: membership.groupOrder,
      tasks: [],
    };
    group.tasks.push(task);
    groups.set(membership.group, group);
  }

  return [...groups.values()]
    .sort((left, right) => left.order - right.order)
    .map((group) => ({
      ...group,
      tasks: [...group.tasks].sort((left, right) => {
        const leftOrder = left.collections.find(({ id }) => id === 'leetcode75')?.orderInGroup ?? 0;
        const rightOrder = right.collections.find(({ id }) => id === 'leetcode75')?.orderInGroup ?? 0;
        return leftOrder - rightOrder;
      }),
    }));
}

export function assertValidPracticeTasks(tasks: readonly PracticeTask[]): void {
  const ids = new Set<string>();
  for (const task of tasks) {
    if (ids.has(task.id)) throw new Error(`duplicate practice task id: ${task.id}`);
    ids.add(task.id);
    if (!task.id.startsWith(`${task.provider}:`)) {
      throw new Error(`practice task ${task.id} does not match provider ${task.provider}`);
    }
    if (!task.providerTaskId.trim() || !task.title.trim() || !task.providerSlug.trim()) {
      throw new Error(`practice task ${task.id} has incomplete provider metadata`);
    }
    if (!task.url.startsWith('https://')) throw new Error(`practice task ${task.id} lacks canonical URL`);
    if (task.prerequisiteLessonIds.length === 0 || task.topics.length === 0) {
      throw new Error(`practice task ${task.id} lacks learning metadata`);
    }
    if (new Set(task.collections.map(({ id }) => id)).size !== task.collections.length) {
      throw new Error(`practice task ${task.id} repeats collection membership`);
    }
  }
}
