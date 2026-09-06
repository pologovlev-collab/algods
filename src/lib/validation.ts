import type { LessonDocument } from './content';

export interface ValidationIssue {
  filePath: string;
  field: string;
  message: string;
}

export const REASONING_MARKER_ORDER = [
  'problem-shape',
  'brute-force',
  'bottleneck',
  'key-observation',
  'invariant-state',
  'algorithm',
  'implementation',
  'complexity',
  'edge-cases',
  'tests',
  'recognition',
  'when-not-to-use',
  'mini-check-1',
  'mini-check-2',
  'guided-practice',
  'takeaway',
] as const;

export const REQUIRED_REASONING_MARKERS = [
  'problem-shape',
  'key-observation',
  'recognition',
  'mini-check-1',
  'mini-check-2',
  'guided-practice',
  'takeaway',
] as const;

const LEGACY_GENERIC_HEADINGS = new Set([
  'Форма задачи',
  'Полный перебор',
  'Узкое место',
  'Ключевое наблюдение',
  'Инвариант или состояние',
  'Алгоритм',
  'Реализация',
  'Сложность и допущения',
  'Граничные случаи',
  'Тесты',
  'Как распознать',
  'Когда не применять',
  'Мини-проверка 1',
  'Мини-проверка 2',
  'Практика с подсказками',
]);

const extractFences = (body: string, language: 'cpp' | 'python'): string[] => [
  ...body.matchAll(new RegExp(`\`\`\`${language}\\s*\\r?\\n([\\s\\S]*?)\\r?\\n\`\`\``, 'g')),
].map((match) => match[1] ?? '');

export function validateLessonDocument(lesson: LessonDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (field: string, message: string) => issues.push({ filePath: lesson.filePath, field, message });
  const { data, body } = lesson;

  if (!/^s\d{2}-l\d{2}$/.test(data.id)) add('id', 'must match sNN-lNN');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) add('slug', 'must be kebab-case');
  if (!Number.isInteger(data.stage) || data.stage < 0 || data.stage > 20) add('stage', 'must be an integer from 0 to 20');
  if (!Number.isInteger(data.order) || data.order < 1) add('order', 'must be a positive integer');
  if (data.core !== true) add('core', 'lesson collection is core-only');
  if (!Array.isArray(data.patterns) || data.patterns.length === 0) add('patterns', 'must include at least one pattern');
  if (!Array.isArray(data.outcomes) || data.outcomes.length < 2) add('outcomes', 'must include at least two outcomes');
  for (const outcome of data.outcomes ?? []) {
    const words = outcome.trim().split(/\s+/).map((word) => word.replace(/[,.!?;:…]+$/u, ''));
    const startsLowercase = /^[а-яё]/u.test(words[0] ?? '');
    const beginsAsAbility = words.slice(0, 3).some((word) => /(?:ть|ти|чь)$/u.test(word));
    if (!startsLowercase || !beginsAsAbility) {
      add('outcomes', `must begin as a lowercase ability phrase with an infinitive: ${outcome}`);
    }
  }
  if (data.practice?.miniChecks < 2) add('practice.miniChecks', 'must include two real mini-checks');
  if (data.practice?.guidedExercises < 1) add('practice.guidedExercises', 'must include a guided exercise');

  const markerMatches = [...body.matchAll(/<!--\s*algods:([a-z0-9-]+)\s*-->/g)];
  const markerNames = markerMatches.map((match) => match[1] ?? '');
  const independentCount = data.practice?.independentExercises ?? 0;
  const allowedMarkers = new Set<string>([
    ...REASONING_MARKER_ORDER,
    ...(independentCount > 0 ? ['independent-practice'] : []),
  ]);
  const canonicalOrder: string[] = [...REASONING_MARKER_ORDER];
  if (independentCount > 0) canonicalOrder.splice(-1, 0, 'independent-practice');

  for (const marker of REQUIRED_REASONING_MARKERS) {
    const count = markerNames.filter((candidate) => candidate === marker).length;
    if (count !== 1) add('body.markers', `expected exactly one marker: ${marker}; found ${count}`);
  }
  if (markerNames.includes('implementation')) {
    for (const companion of ['complexity', 'tests']) {
      if (!markerNames.includes(companion)) {
        add('body.markers', `implementation lessons must include ${companion}`);
      }
    }
  }
  for (const marker of markerNames) {
    if (!allowedMarkers.has(marker)) add('body.markers', `unknown reasoning marker: ${marker}`);
    const count = markerNames.filter((candidate) => candidate === marker).length;
    if (count > 1) add('body.markers', `reasoning marker must not repeat: ${marker}`);
  }
  const independentMarkerCount = markerNames.filter((marker) => marker === 'independent-practice').length;
  if (independentMarkerCount !== (independentCount > 0 ? 1 : 0)) {
    add(
      'practice.independentExercises',
      `independent-practice marker does not match metadata count ${independentCount}`,
    );
  }
  const markersInCanonicalOrder = canonicalOrder.filter((marker) => markerNames.includes(marker));
  if (markerNames.join('|') !== markersInCanonicalOrder.join('|')) {
    add('body.markers', `present markers must follow the reasoning order: ${canonicalOrder.join(' -> ')}`);
  }

  for (let index = 0; index < markerMatches.length; index += 1) {
    const marker = markerMatches[index];
    const next = markerMatches[index + 1];
    if (marker?.index === undefined) continue;
    const sectionStart = marker.index + marker[0].length;
    const sectionEnd = next?.index ?? body.length;
    const section = body.slice(sectionStart, sectionEnd);
    if (!/^\s*## [^\r\n]+\s*$/m.test(section)) {
      add('body.headings', `marker ${marker[1] ?? '<unknown>'} must introduce a visible H2`);
    }
  }

  const headings = [...body.matchAll(/^## ([^\r\n]+)\s*$/gm)].map((match) => (match[1] ?? '').trim());
  if (new Set(headings).size !== headings.length) add('body.headings', 'contains duplicate visible H2 headings');
  for (const heading of headings) {
    if (LEGACY_GENERIC_HEADINGS.has(heading)) {
      add('body.headings', `generic visible heading is not lesson-specific: ${heading}`);
    }
  }

  const independentMarker = markerMatches.find((match) => match[1] === 'independent-practice');
  const takeawayMarker = markerMatches.find((match) => match[1] === 'takeaway');
  const independentBody = independentMarker?.index !== undefined
    ? body.slice(
        independentMarker.index + independentMarker[0].length,
        takeawayMarker?.index ?? body.length,
      )
    : '';
  const independentTasks = [...independentBody.matchAll(/^### Задача (\d+)\s*$/gm)].map(
    (match) => Number(match[1]),
  );
  const expectedTaskNumbers = Array.from({ length: independentCount }, (_, index) => index + 1);
  if (independentTasks.join('|') !== expectedTaskNumbers.join('|')) {
    add(
      'practice.independentExercises',
      `expected independent tasks ${expectedTaskNumbers.join(', ') || 'none'}; found ${independentTasks.join(', ') || 'none'}`,
    );
  }

  if (!new RegExp(`^# ${data.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm').test(body)) {
    add('body.title', 'must include an H1 matching the lesson title');
  }

  const cppFences = extractFences(body, 'cpp');
  const pythonFences = extractFences(body, 'python');
  const hasImplementation = markerNames.includes('implementation');
  if (hasImplementation) {
    if (!/^### C\+\+17\s*$/m.test(body) || cppFences.length !== 1) {
      add('code.cpp', 'implementation section requires exactly one fenced C++17 example');
    } else if (!/\bassert\s*\(/.test(cppFences[0] ?? '')) {
      add('code.cpp', 'C++17 implementation must include an executable assertion');
    }
    if (!/^### Python 3\s*$/m.test(body) || pythonFences.length !== 1) {
      add('code.python', 'implementation section requires exactly one fenced Python 3 example');
    } else if (!/^\s*assert\b/m.test(pythonFences[0] ?? '')) {
      add('code.python', 'Python 3 implementation must include an executable assertion');
    }
  } else if (cppFences.length > 0 || pythonFences.length > 0) {
    add('body.markers', 'code examples require an implementation marker');
  }
  if (/\b(?:TODO|TBD|placeholder)\b/i.test(body)) add('body', 'contains placeholder copy');

  return issues;
}

export function validateCurriculum(lessons: readonly LessonDocument[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const byId = new Map<string, LessonDocument>();
  const slugs = new Map<string, LessonDocument>();
  const stageOrder = new Map<string, LessonDocument>();
  const headings = new Map<string, LessonDocument>();

  for (const lesson of lessons) {
    const { data, filePath } = lesson;
    if (byId.has(data.id)) issues.push({ filePath, field: 'id', message: `duplicate ID: ${data.id}` });
    else byId.set(data.id, lesson);
    if (slugs.has(data.slug)) issues.push({ filePath, field: 'slug', message: `duplicate slug: ${data.slug}` });
    else slugs.set(data.slug, lesson);
    const key = `${data.stage}:${data.order}`;
    if (stageOrder.has(key)) issues.push({ filePath, field: 'order', message: `duplicate stage/order: ${key}` });
    else stageOrder.set(key, lesson);

    for (const heading of [...lesson.body.matchAll(/^## ([^\r\n]+)\s*$/gm)].map((match) => (match[1] ?? '').trim())) {
      const previous = headings.get(heading);
      if (previous) {
        issues.push({
          filePath,
          field: 'body.headings',
          message: `duplicate visible H2 across lessons: ${heading} (also in ${previous.data.id})`,
        });
      } else {
        headings.set(heading, lesson);
      }
    }
  }

  for (const lesson of lessons) {
    for (const prerequisite of lesson.data.prerequisites) {
      const prerequisiteLesson = byId.get(prerequisite);
      if (!prerequisiteLesson) {
        issues.push({ filePath: lesson.filePath, field: 'prerequisites', message: `unknown lesson: ${prerequisite}` });
      } else if (
        prerequisiteLesson.data.stage > lesson.data.stage ||
        (
          prerequisiteLesson.data.stage === lesson.data.stage &&
          prerequisiteLesson.data.order >= lesson.data.order
        )
      ) {
        issues.push({
          filePath: lesson.filePath,
          field: 'prerequisites',
          message: `prerequisite ${prerequisite} must precede ${lesson.data.id} in course order`,
        });
      }
      if (prerequisite === lesson.data.id) {
        issues.push({ filePath: lesson.filePath, field: 'prerequisites', message: 'lesson cannot require itself' });
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      issues.push({ filePath: byId.get(id)?.filePath ?? '<curriculum>', field: 'prerequisites', message: `cycle contains ${id}` });
      return;
    }
    visiting.add(id);
    for (const dependency of byId.get(id)?.data.prerequisites ?? []) {
      if (byId.has(dependency)) visit(dependency);
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of byId.keys()) visit(id);

  return issues;
}
