export type SupplementaryDifficulty = 'Easy' | 'Medium';
export type SupplementaryPracticeMode = 'transfer' | 'independent';

export interface SupplementaryProblem {
  id: number;
  title: string;
  url: string;
  provider: 'CodeRun';
  verifiedAt: '2026-08-20';
  difficulty: SupplementaryDifficulty;
  primaryPattern: string;
  recommendedStage: number;
  practiceMode: SupplementaryPracticeMode;
  prerequisiteLessonIds: string[];
  learningNoteRu: string;
}

/**
 * A deliberately small Russian-language transfer set. Metadata and links were
 * checked against the official CodeRun catalogue and problem pages on
 * 2026-08-20. These tasks complement, rather than alter, the official LC75 set.
 */
export const supplementaryProblems: SupplementaryProblem[] = [
  {
    id: 20,
    title: 'Гистограмма и прямоугольник',
    url: 'https://coderun.yandex.ru/problem/histogram-and-rectangle',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Medium',
    primaryPattern: 'Монотонный стек',
    recommendedStage: 6,
    practiceMode: 'transfer',
    prerequisiteLessonIds: ['s06-l03'],
    learningNoteRu: 'Перенесите инвариант монотонного стека на границы прямоугольника.',
  },
  {
    id: 1,
    title: 'Средний элемент',
    url: 'https://coderun.yandex.ru/problem/median-out-of-three',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Easy',
    primaryPattern: 'Сортировка и сравнения',
    recommendedStage: 7,
    practiceMode: 'independent',
    prerequisiteLessonIds: ['s07-l01'],
    learningNoteRu: 'Сравните несколько корректных способов найти медиану трёх чисел.',
  },
  {
    id: 8,
    title: 'Компоненты связности',
    url: 'https://coderun.yandex.ru/problem/connectivity-components',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Medium',
    primaryPattern: 'Обход графа',
    recommendedStage: 13,
    practiceMode: 'transfer',
    prerequisiteLessonIds: ['s13-l02'],
    learningNoteRu: 'Запускайте новый обход только из ещё не посещённой вершины.',
  },
  {
    id: 12,
    title: 'Длина кратчайшего пути',
    url: 'https://coderun.yandex.ru/problem/shortest-path-length',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Easy',
    primaryPattern: 'BFS',
    recommendedStage: 13,
    practiceMode: 'independent',
    prerequisiteLessonIds: ['s13-l03'],
    learningNoteRu: 'Сначала распознайте невзвешенный граф, затем обоснуйте порядок слоёв BFS.',
  },
  {
    id: 10,
    title: 'Топологическая сортировка',
    url: 'https://coderun.yandex.ru/problem/topological-sorting',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Medium',
    primaryPattern: 'Топологическая сортировка',
    recommendedStage: 13,
    practiceMode: 'independent',
    prerequisiteLessonIds: ['s13-l04'],
    learningNoteRu: 'Выведите порядок из зависимостей и отдельно обработайте наличие цикла.',
  },
  {
    id: 6,
    title: 'НОП с восстановлением ответа',
    url: 'https://coderun.yandex.ru/problem/nop-with-response-recovery',
    provider: 'CodeRun',
    verifiedAt: '2026-08-20',
    difficulty: 'Medium',
    primaryPattern: 'Динамическое программирование',
    recommendedStage: 16,
    practiceMode: 'transfer',
    prerequisiteLessonIds: ['s16-l02'],
    learningNoteRu: 'После таблицы состояний восстановите саму подпоследовательность обратным проходом.',
  },
];
