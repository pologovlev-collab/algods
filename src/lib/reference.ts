import { coreReferenceTopics } from '../data/core-reference-topics';
import { patterns } from '../data/patterns';
import { referenceTopics } from '../data/reference-topics';
import type { ReferenceDeepDive } from '../data/reference-topics';

export type ReferenceCategoryId = 'core-patterns' | 'data-structures' | 'advanced';

export interface ReferenceCategory {
  id: ReferenceCategoryId;
  title: string;
  description: string;
}

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  {
    id: 'core-patterns',
    title: 'Основные алгоритмы и паттерны',
    description: 'Короткие ориентиры для выбора подхода: сигнал задачи, рабочая оценка и граница применимости.',
  },
  {
    id: 'data-structures',
    title: 'Структуры данных',
    description: 'Операционные контракты структур: что они ускоряют, сколько стоят и какой инвариант нельзя нарушить.',
  },
  {
    id: 'advanced',
    title: 'Продвинутые структуры и алгоритмы',
    description: 'Темы после основного маршрута с явными предварительными знаниями и точными ограничениями.',
  },
];

export interface ReferenceLesson {
  id: string;
  slug: string;
  title: string;
  prerequisites: string[];
  patterns: string[];
  summary: string;
  outcomes: string[];
}

export interface ReferenceEntry {
  id: string;
  slug: string;
  href: string;
  title: string;
  aliases: string[];
  category: ReferenceCategoryId;
  source: 'core' | 'advanced';
  definition: string;
  useWhen: string;
  decisionNotes: string[];
  complexity: string[];
  pitfalls: string[];
  prerequisiteLessonIds: string[];
  courseLessonIds: string[];
  patternId?: string;
  deepDives?: ReferenceDeepDive[];
}

export interface ReferenceGroup {
  category: ReferenceCategory;
  entries: ReferenceEntry[];
}

export function buildReferenceEntries(sourceLessons: readonly ReferenceLesson[]): ReferenceEntry[] {
  const lessonById = new Map(sourceLessons.map((lesson) => [lesson.id, lesson]));
  const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));

  const coreEntries = coreReferenceTopics.map((topic): ReferenceEntry => {
    const pattern = patternById.get(topic.patternId);
    if (!pattern) throw new Error(`Core reference uses unknown pattern ${topic.patternId}.`);

    const lesson = lessonById.get(topic.lessonId);
    if (!lesson) throw new Error(`Core reference ${topic.patternId} uses unknown lesson ${topic.lessonId}.`);
    if (!lesson.patterns.includes(topic.patternId)) {
      throw new Error(`Core reference lesson ${topic.lessonId} does not teach pattern ${topic.patternId}.`);
    }

    return {
      id: `core:${topic.patternId}`,
      slug: topic.patternId,
      href: `/reference/${topic.patternId}/`,
      title: pattern.title,
      aliases: [...topic.aliases],
      category: topic.category,
      source: 'core',
      definition: lesson.summary,
      useWhen: pattern.signal,
      decisionNotes: lesson.outcomes.map((outcome) => `Уметь ${outcome}.`),
      complexity: [...topic.complexity],
      pitfalls: [...topic.pitfalls],
      prerequisiteLessonIds: [...lesson.prerequisites],
      courseLessonIds: [lesson.id],
      patternId: pattern.id,
    };
  });

  const advancedEntries = referenceTopics.map((topic): ReferenceEntry => ({
    id: topic.id,
    slug: topic.slug,
    href: `/reference/${topic.slug}/`,
    title: topic.title,
    aliases: [...topic.aliases],
    category: 'advanced',
    source: 'advanced',
    definition: topic.scope,
    useWhen: topic.useWhen,
    decisionNotes: [...topic.decisionNotes],
    complexity: [...topic.complexity],
    pitfalls: [...topic.pitfalls],
    prerequisiteLessonIds: [...topic.prerequisites],
    courseLessonIds: [],
    ...(topic.deepDives ? {
      deepDives: topic.deepDives.map((deepDive) => ({
        ...deepDive,
        mechanics: [...deepDive.mechanics],
        chooseWhen: [...deepDive.chooseWhen],
        ...(deepDive.codeExamples ? {
          codeExamples: deepDive.codeExamples.map((example) => ({ ...example })),
        } : {}),
      })),
    } : {}),
  }));

  return [...coreEntries, ...advancedEntries];
}

export function groupReferenceEntries(entries: readonly ReferenceEntry[]): ReferenceGroup[] {
  return REFERENCE_CATEGORIES.map((category) => ({
    category,
    entries: entries.filter((entry) => entry.category === category.id),
  }));
}
