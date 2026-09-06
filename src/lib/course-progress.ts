export type StoredCourseLessonStatus = 'in-progress' | 'completed';
export type CourseLessonProgressState = StoredCourseLessonStatus | 'ready' | 'blocked';

export interface CourseProgressLesson {
  id: string;
  prerequisites: readonly string[];
}

export function getCourseLessonProgressState(
  lesson: CourseProgressLesson,
  statuses: Readonly<Record<string, StoredCourseLessonStatus | undefined>>,
): CourseLessonProgressState {
  const savedStatus = statuses[lesson.id];
  if (savedStatus === 'completed' || savedStatus === 'in-progress') return savedStatus;

  const ready = lesson.prerequisites.every((id) => statuses[id] === 'completed');
  return ready ? 'ready' : 'blocked';
}

export function deriveCourseLessonStates(
  lessons: readonly CourseProgressLesson[],
  statuses: Readonly<Record<string, StoredCourseLessonStatus | undefined>>,
): Record<string, CourseLessonProgressState> {
  return Object.fromEntries(
    lessons.map((lesson) => [lesson.id, getCourseLessonProgressState(lesson, statuses)]),
  );
}

export function selectCourseContinuation<TLesson extends CourseProgressLesson>(
  lessons: readonly TLesson[],
  statuses: Readonly<Record<string, StoredCourseLessonStatus | undefined>>,
): TLesson | null {
  const states = deriveCourseLessonStates(lessons, statuses);
  return lessons.find(({ id }) => states[id] === 'in-progress')
    ?? lessons.find(({ id }) => states[id] === 'ready')
    ?? null;
}

export function deriveCourseContinuation<TLesson extends CourseProgressLesson>(
  lessons: readonly TLesson[],
  statuses: Readonly<Record<string, StoredCourseLessonStatus | undefined>>,
): { lesson: TLesson; action: 'start' | 'continue' } | null {
  const lesson = selectCourseContinuation(lessons, statuses);
  if (!lesson) return null;

  return {
    lesson,
    action: Object.keys(statuses).length === 0 ? 'start' : 'continue',
  };
}
