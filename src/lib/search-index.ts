import { PRACTICE_PROVIDER_LABELS } from '../data/practice';
import { patterns } from '../data/patterns';
import type { CourseStage } from '../data/stages';
import type { PracticeTask } from './practice';
import type { ReferenceEntry, ReferenceLesson } from './reference';
import type { SearchEntry, SearchEntryType } from './search';

interface SearchLesson extends ReferenceLesson {
  stage: number;
}

export interface SearchIndexSources {
  lessons: readonly SearchLesson[];
  stages: readonly CourseStage[];
  references: readonly ReferenceEntry[];
  practiceTasks: readonly PracticeTask[];
}

interface SearchEntryDraft {
  id: string;
  type: SearchEntryType;
  href: string;
  title: string;
  aliases: string[];
  topics: string[];
  context: string;
}

const sectionEntries: SearchEntryDraft[] = [
  {
    id: 'section:course',
    type: 'section',
    href: '/course/',
    title: 'Курс',
    aliases: ['course', 'уроки', 'обучение'],
    topics: ['54 урока', '21 этап', 'маршрут обучения'],
    context: 'Все уроки и этапы AlgoDS',
  },
  {
    id: 'section:roadmap',
    type: 'section',
    href: '/roadmap/',
    title: 'Карта знаний',
    aliases: ['knowledge map', 'roadmap', 'граф зависимостей'],
    topics: ['зависимости уроков', 'готовность', 'прогресс'],
    context: 'Зависимости, готовность и прогресс по курсу',
  },
  {
    id: 'section:practice',
    type: 'section',
    href: '/practice/',
    title: 'Практика',
    aliases: ['practice', 'problems', 'задачи'],
    topics: ['LeetCode 75', 'CodeRun', 'Codewars', 'задачи для собеседований'],
    context: 'LeetCode 75, русскоязычные задачи CodeRun и задачи Codewars',
  },
  {
    id: 'section:leetcode-75',
    type: 'section',
    href: '/leetcode-75/',
    title: 'LeetCode 75',
    aliases: ['lc75', 'leetcode study plan', 'литкод 75'],
    topics: ['официальный список', 'статусы решения', 'интервью'],
    context: 'Официальный список и локальные статусы',
  },
  {
    id: 'section:reference',
    type: 'section',
    href: '/reference/',
    title: 'Справочник',
    aliases: ['reference', 'guide', 'шпаргалка'],
    topics: ['алгоритмы', 'структуры данных', 'сложность'],
    context: 'Сигналы задач, сложность и границы применимости',
  },
];

const uniqueText = (values: readonly string[]): string[] => [
  ...new Set(values.map((value) => value.trim()).filter(Boolean)),
];

export function buildSearchIndex({
  lessons,
  stages,
  references,
  practiceTasks,
}: SearchIndexSources): SearchEntry[] {
  const drafts: SearchEntryDraft[] = [...sectionEntries];
  const stageById = new Map(stages.map((stage) => [stage.id, stage]));
  const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));
  const referenceAliasesByPattern = new Map(
    references.flatMap((entry) => entry.patternId ? [[entry.patternId, entry.aliases] as const] : []),
  );

  stages.forEach((stage) => drafts.push({
    id: `stage:${stage.id}`,
    type: 'stage',
    href: `/course/#stage-${stage.id}`,
    title: stage.title,
    aliases: uniqueText([stage.slug, `stage ${stage.id}`, `этап ${stage.id}`]),
    topics: uniqueText([stage.description, stage.slug.replaceAll('-', ' ')]),
    context: `Этап ${stage.id} · ${stage.description}`,
  }));

  lessons.forEach((lesson) => {
    const patternDefinitions = lesson.patterns
      .map((patternId) => patternById.get(patternId))
      .filter((pattern): pattern is NonNullable<typeof pattern> => Boolean(pattern));
    const aliases = uniqueText([
      lesson.slug.replaceAll('-', ' '),
      ...lesson.patterns,
      ...patternDefinitions.map(({ title }) => title),
      ...lesson.patterns.flatMap((patternId) => referenceAliasesByPattern.get(patternId) ?? []),
    ]);
    const stage = stageById.get(lesson.stage);
    drafts.push({
      id: `lesson:${lesson.id}`,
      type: 'lesson',
      href: `/course/${lesson.slug}/`,
      title: lesson.title,
      aliases,
      topics: uniqueText([
        lesson.summary,
        ...lesson.outcomes,
        ...patternDefinitions.map(({ signal }) => signal),
        stage?.title ?? '',
      ]),
      context: `Этап ${lesson.stage} · ${lesson.summary}`,
    });
  });

  references.forEach((entry) => drafts.push({
    id: `reference:${entry.slug}`,
    type: 'reference',
    href: entry.href,
    title: entry.title,
    aliases: uniqueText([entry.slug.replaceAll('-', ' '), ...entry.aliases]),
    topics: uniqueText([
      entry.definition,
      entry.useWhen,
      ...entry.decisionNotes,
      ...entry.complexity,
      ...entry.pitfalls,
    ]),
    context: `Справочник · ${entry.definition}`,
  }));

  practiceTasks.forEach((task) => drafts.push({
    id: `practice:${task.id}`,
    type: 'practice',
    href: task.url,
    title: task.title,
    aliases: uniqueText([
      task.providerSlug.replaceAll('-', ' '),
      PRACTICE_PROVIDER_LABELS[task.provider],
      task.providerTaskId,
      ...task.topics,
      ...task.collections.map(({ group }) => group),
    ]),
    topics: uniqueText([
      task.noteRu,
      `этап ${task.stage}`,
      task.mode,
      task.tier,
    ]),
    context: `Практика · ${PRACTICE_PROVIDER_LABELS[task.provider]} · ${task.nativeLevel?.label ?? 'уровень AlgoDS'} · ${task.topics[0]}`,
  }));

  return drafts.map((entry, sourceOrder) => ({ ...entry, sourceOrder }));
}
