import { leetcode75Problems } from './leetcode75';
import { supplementaryProblems } from './supplementary-practice';
import {
  assertValidPracticeTasks,
  type PracticeMode,
  type PracticeTask,
  type PracticeTier,
} from '../lib/practice';

export const PRACTICE_PROVIDER_LABELS = {
  leetcode: 'LeetCode',
  coderun: 'CodeRun',
  codewars: 'Codewars',
} as const;

export const PRACTICE_TIER_LABELS: Record<PracticeTier, string> = {
  'warm-up': 'Разминка AlgoDS',
  standard: 'Основной уровень AlgoDS',
  stretch: 'С вызовом AlgoDS',
};

export const PRACTICE_MODE_LABELS: Record<PracticeMode, string> = {
  guided: 'С разбором',
  transfer: 'Перенос паттерна',
  independent: 'Самостоятельно',
};

// AlgoDS tier describes task demand, while mode describes how much scaffolding
// the learner receives. Keeping the two axes explicit allows, for example, an
// independent warm-up or a guided stretch task without rewriting provider data.
const taskIdsByTier: Record<PracticeTier, string[]> = {
  'warm-up': [
    'leetcode:1768', 'leetcode:1071', 'leetcode:1431', 'leetcode:345',
    'leetcode:283', 'leetcode:392', 'leetcode:643', 'leetcode:1732',
    'leetcode:724', 'leetcode:2215', 'leetcode:1207', 'leetcode:933',
    'leetcode:206', 'leetcode:104', 'leetcode:872', 'leetcode:700',
    'leetcode:374', 'leetcode:1137', 'leetcode:746', 'leetcode:338',
    'leetcode:136', 'coderun:1',
  ],
  standard: [
    'leetcode:605', 'leetcode:151', 'leetcode:238', 'leetcode:443',
    'leetcode:11', 'leetcode:1679', 'leetcode:1456', 'leetcode:1004',
    'leetcode:1493', 'leetcode:1657', 'leetcode:2352', 'leetcode:2390',
    'leetcode:735', 'leetcode:649', 'leetcode:2095', 'leetcode:328',
    'leetcode:2130', 'leetcode:1448', 'leetcode:437', 'leetcode:1372',
    'leetcode:199', 'leetcode:1161', 'leetcode:450', 'leetcode:841',
    'leetcode:547', 'leetcode:1466', 'leetcode:1926', 'leetcode:994',
    'leetcode:215', 'leetcode:2336', 'leetcode:2300', 'leetcode:162',
    'leetcode:17', 'leetcode:62', 'leetcode:198', 'leetcode:714',
    'leetcode:1318', 'leetcode:208', 'leetcode:435', 'leetcode:452',
    'leetcode:739', 'leetcode:901', 'coderun:20', 'coderun:8',
    'coderun:12',
  ],
  stretch: [
    'leetcode:334', 'leetcode:394', 'leetcode:236', 'leetcode:399',
    'leetcode:2542', 'leetcode:2462', 'leetcode:875', 'leetcode:216',
    'leetcode:790', 'leetcode:1143', 'leetcode:72', 'leetcode:1268',
    'coderun:10', 'coderun:6',
  ],
};

const tierByTaskId = new Map<string, PracticeTier>();
for (const [tier, ids] of Object.entries(taskIdsByTier) as Array<[PracticeTier, string[]]>) {
  for (const id of ids) {
    if (tierByTaskId.has(id)) throw new Error(`practice task ${id} has multiple AlgoDS tiers`);
    tierByTaskId.set(id, tier);
  }
}

const getTaskTier = (id: string): PracticeTier => {
  const tier = tierByTaskId.get(id);
  if (!tier) throw new Error(`practice task ${id} lacks an explicit AlgoDS tier`);
  return tier;
};

const leetcodeTasks: PracticeTask[] = leetcode75Problems.map((problem) => ({
  id: `leetcode:${problem.id}`,
  provider: 'leetcode',
  providerTaskId: problem.id,
  providerSlug: problem.slug,
  title: problem.title,
  url: problem.url,
  nativeLevel: { system: 'difficulty', label: problem.difficulty },
  tier: getTaskTier(`leetcode:${problem.id}`),
  stage: problem.recommendedStage,
  prerequisiteLessonIds: [...problem.prerequisiteLessonIds],
  topics: [...new Set([problem.primaryPattern, ...problem.secondaryPatterns])],
  mode: problem.practiceMode,
  collections: [{
    id: 'leetcode75',
    order: problem.officialOrder,
    group: problem.officialGroup,
    groupOrder: problem.officialGroupOrder,
    orderInGroup: problem.officialOrderInGroup,
  }],
  noteRu: problem.learningNoteRu,
  verification: { verifiedAt: problem.verifiedAt, source: 'official-provider' },
}));

const coderunTasks: PracticeTask[] = supplementaryProblems.map((problem) => ({
  id: `coderun:${problem.id}`,
  provider: 'coderun',
  providerTaskId: String(problem.id),
  providerSlug: new URL(problem.url).pathname.split('/').filter(Boolean).at(-1) ?? String(problem.id),
  title: problem.title,
  url: problem.url,
  nativeLevel: { system: 'difficulty', label: problem.difficulty },
  tier: getTaskTier(`coderun:${problem.id}`),
  stage: problem.recommendedStage,
  prerequisiteLessonIds: [...problem.prerequisiteLessonIds],
  topics: [problem.primaryPattern],
  mode: problem.practiceMode,
  collections: [],
  noteRu: problem.learningNoteRu,
  verification: { verifiedAt: problem.verifiedAt, source: 'official-provider' },
}));

export const practiceTasks: PracticeTask[] = [...leetcodeTasks, ...coderunTasks];

if (tierByTaskId.size !== practiceTasks.length) {
  throw new Error('explicit AlgoDS tiers do not match the normalized practice catalogue');
}

assertValidPracticeTasks(practiceTasks);
