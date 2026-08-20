export interface CourseStage {
  id: number;
  slug: string;
  title: string;
  description: string;
}

export const stages: CourseStage[] = [
  { id: 0, slug: 'algorithmic-thinking', title: 'Как думать о задачах', description: 'Ограничения, сложность, перебор, инварианты и тестирование.' },
  { id: 1, slug: 'language-toolkit', title: 'Инструменты языка', description: 'Практический мост к контейнерам, сортировке и рекурсии в C++ и Python.' },
  { id: 2, slug: 'arrays-strings-hashing', title: 'Массивы, строки и хеширование', description: 'Линейные обходы, быстрый поиск, частоты и группировка.' },
  { id: 3, slug: 'two-pointers', title: 'Два указателя', description: 'Движение границ с доказуемо безопасным отбрасыванием вариантов.' },
  { id: 4, slug: 'sliding-window', title: 'Скользящее окно', description: 'Поддержание свойства непрерывного фрагмента без повторного пересчёта.' },
  { id: 5, slug: 'prefix-techniques', title: 'Префиксные техники', description: 'Накопленная информация для диапазонов и подмассивов.' },
  { id: 6, slug: 'stack-queue-deque', title: 'Стек, очередь и дек', description: 'Порядок обработки и монотонные структуры.' },
  { id: 7, slug: 'sorting-intervals', title: 'Сортировка и интервалы', description: 'Как порядок данных открывает структуру решения.' },
  { id: 8, slug: 'binary-search', title: 'Бинарный поиск', description: 'Точные границы, инварианты и поиск по ответу.' },
  { id: 9, slug: 'linked-lists', title: 'Связные списки', description: 'Перенаправление ссылок, слияние, разворот и циклы.' },
  { id: 10, slug: 'trees', title: 'Деревья', description: 'Обходы, рекурсивные возвраты, уровни и BST.' },
  { id: 11, slug: 'heap-priority-queue', title: 'Куча и приоритетная очередь', description: 'Повторный доступ к экстремуму, Top K и потоки.' },
  { id: 12, slug: 'backtracking', title: 'Бэктрекинг', description: 'Перебор дерева решений с откатом и отсечениями.' },
  { id: 13, slug: 'graphs-grids', title: 'Графы и сетки', description: 'Связность, обходы, зависимости и кратчайшие пути.' },
  { id: 14, slug: 'greedy', title: 'Жадные алгоритмы', description: 'Локальный выбор только вместе с доказательством безопасности.' },
  { id: 15, slug: 'dynamic-programming-foundations', title: 'Основы динамического программирования', description: 'Состояние, переход, база, порядок и восстановление ответа.' },
  { id: 16, slug: 'sequence-dp', title: 'Двумерное и последовательностное DP', description: 'Сетки и пары последовательностей.' },
  { id: 17, slug: 'trie', title: 'Trie', description: 'Практический индекс строковых префиксов.' },
  { id: 18, slug: 'bit-manipulation', title: 'Битовые операции', description: 'Безопасные маски, XOR и множества малого размера.' },
  { id: 19, slug: 'pattern-recognition', title: 'Распознавание паттернов', description: 'Выбор техники по свойствам задачи, а не по ключевым словам.' },
  { id: 20, slug: 'interview-graduation', title: 'Собеседование: итог', description: 'Смешанная практика, объяснение решения и план повторения.' },
];
