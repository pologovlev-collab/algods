export interface CourseLessonSummary {
  id: string;
  slug: string;
  title: string;
  stage: number;
  order: number;
  prerequisites: string[];
}

export interface PracticeOrderable {
  recommendedStage: number;
  practiceMode: 'guided' | 'transfer' | 'independent';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  officialOrder: number;
}

export type LessonReadiness = 'ready' | 'blocked' | 'completed';
export type ProblemReadiness = 'ready' | 'blocked';

export function orderCourseLessons<T extends CourseLessonSummary>(lessons: readonly T[]): T[] {
  return [...lessons].sort(
    (left, right) =>
      left.stage - right.stage ||
      left.order - right.order ||
      left.id.localeCompare(right.id),
  );
}

export function getLessonNavigation<T extends CourseLessonSummary>(
  orderedLessons: readonly T[],
  lessonId: string,
): { previous: T | null; next: T | null } {
  const index = orderedLessons.findIndex(({ id }) => id === lessonId);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? (orderedLessons[index - 1] ?? null) : null,
    next: index + 1 < orderedLessons.length ? (orderedLessons[index + 1] ?? null) : null,
  };
}

export function getLessonReadiness(
  lesson: CourseLessonSummary,
  completedLessonIds: ReadonlySet<string>,
): LessonReadiness {
  if (completedLessonIds.has(lesson.id)) return 'completed';
  return lesson.prerequisites.every((id) => completedLessonIds.has(id)) ? 'ready' : 'blocked';
}

export function getProblemReadiness(
  prerequisiteLessonIds: readonly string[],
  completedLessonIds: ReadonlySet<string>,
): ProblemReadiness {
  return prerequisiteLessonIds.every((id) => completedLessonIds.has(id))
    ? 'ready'
    : 'blocked';
}

export function getPracticeAnchorLessonId(
  prerequisiteLessonIds: readonly string[],
  orderedLessons: readonly CourseLessonSummary[],
): string | null {
  const prerequisiteIds = new Set(prerequisiteLessonIds);
  const anchor = [...orderedLessons]
    .reverse()
    .find(({ id }) => prerequisiteIds.has(id));
  return anchor?.id ?? null;
}

export function orderPracticeProblems<T extends PracticeOrderable>(problems: readonly T[]): T[] {
  const modeRank = { guided: 0, transfer: 1, independent: 2 } as const;
  const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 } as const;
  return [...problems].sort(
    (left, right) =>
      left.recommendedStage - right.recommendedStage ||
      modeRank[left.practiceMode] - modeRank[right.practiceMode] ||
      difficultyRank[left.difficulty] - difficultyRank[right.difficulty] ||
      left.officialOrder - right.officialOrder,
  );
}

export function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, completed / total)) * 100);
}
