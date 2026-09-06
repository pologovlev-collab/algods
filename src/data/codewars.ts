import type { PracticeMode, PracticeTier } from '../lib/practice';

export type CodewarsRank = '8 kyu' | '7 kyu' | '6 kyu' | '5 kyu' | '4 kyu';

export interface CodewarsKata {
  id: string;
  title: string;
  slug: string;
  url: string;
  provider: 'Codewars';
  verifiedAt: '2026-09-06';
  rank: CodewarsRank;
  supportedLanguages: ['cpp', 'python'];
  topics: string[];
  recommendedStage: number;
  practiceMode: PracticeMode;
  tier: PracticeTier;
  prerequisiteLessonIds: string[];
  learningNoteRu: string;
}

export const CODEWARS_PROVENANCE = {
  provider: 'Codewars',
  verifiedAt: '2026-09-06',
  sourceUrl: 'https://www.codewars.com/api/v1/code-challenges/{challenge}',
} as const;

type Draft = Omit<CodewarsKata, 'url' | 'provider' | 'verifiedAt' | 'supportedLanguages'>;
const k = (id: string, title: string, slug: string, rank: CodewarsRank, topics: string[],
  recommendedStage: number, practiceMode: PracticeMode, tier: PracticeTier,
  prerequisiteLessonIds: string[], learningNoteRu: string): Draft => ({
  id, title, slug, rank, topics, recommendedStage, practiceMode, tier,
  prerequisiteLessonIds, learningNoteRu,
});

const drafts: Draft[] = [
  k('54ba84be607a92aa900000f1', 'Isograms', 'isograms', '7 kyu', ['Hash set', 'Повторы'], 2, 'transfer', 'warm-up', ['s02-l02'], 'Остановитесь при первом повторе и явно нормализуйте регистр перед проверкой.'),
  k('529eef7a9194e0cbc1000255', 'Anagram Detection', 'anagram-detection', '7 kyu', ['Частоты', 'Строки'], 2, 'transfer', 'standard', ['s02-l03'], 'Сравните частотные представления вместо перебора возможных перестановок.'),
  k('558fc85d8fd1938afb000014', 'Sum of two lowest positive integers', 'sum-of-two-lowest-positive-integers', '7 kyu', ['Два минимума', 'Сортировка'], 7, 'transfer', 'standard', ['s07-l01'], 'Сравните полную сортировку с одним проходом, который хранит два лучших кандидата.'),
  k('5656b6906de340bd1b0000ac', 'Two to One', 'two-to-one', '7 kyu', ['Множества', 'Сортировка'], 2, 'transfer', 'warm-up', ['s02-l02'], 'Сначала устраните дубликаты множеством, затем отдельно обеспечьте порядок результата.'),
  k('54da5a58ea159efa38000836', 'Find the odd int', 'find-the-odd-int', '6 kyu', ['XOR', 'Частоты'], 18, 'transfer', 'standard', ['s18-l02'], 'Сравните частотный словарь с XOR-инвариантом и объясните ограничения второго подхода.'),
  k('54bf1c2cd5b56cc47f0007a1', 'Counting Duplicates', 'counting-duplicates', '6 kyu', ['Частоты', 'Нормализация'], 2, 'transfer', 'standard', ['s02-l03'], 'Нормализуйте регистр до подсчёта и считайте значения, а не число повторных появлений.'),
  k('54b42f9314d9229fd6000d9c', 'Duplicate Encoder', 'duplicate-encoder', '6 kyu', ['Частоты', 'Преобразование строки'], 2, 'independent', 'standard', ['s02-l03'], 'Сначала соберите глобальные частоты, затем преобразуйте каждый символ по готовому контексту.'),
  k('5277c8a221e209d3f6000b56', 'Valid Braces', 'valid-braces', '6 kyu', ['Стек', 'Скобочная последовательность'], 6, 'transfer', 'standard', ['s06-l01'], 'Храните только незакрытые открывающие скобки и отклоняйте первое несовместимое закрытие.'),
  k('54e6533c92449cc251001667', 'Unique In Order', 'unique-in-order', '6 kyu', ['Два указателя', 'Удаление соседних дублей'], 3, 'guided', 'warm-up', ['s03-l02'], 'Сравнивайте элемент только с последним добавленным результатом, а не со всем префиксом.'),
  k('52597aa56021e91c93000cb0', 'Moving Zeros To The End', 'moving-zeros-to-the-end', '5 kyu', ['Два указателя', 'Стабильная фильтрация'], 3, 'transfer', 'standard', ['s03-l02'], 'Сохраняйте относительный порядок ненулевых элементов и отделяйте запись от чтения.'),
  k('550f22f4d758534c1100025a', 'Directions Reduction', 'directions-reduction', '5 kyu', ['Стек', 'Сокращение последовательности'], 6, 'independent', 'standard', ['s06-l01'], 'Удаляйте взаимно обратные соседние шаги сразу, поддерживая несокращаемый префикс.'),
  k('51ba717bb08c1cd60f00002f', 'Range Extraction', 'range-extraction', '4 kyu', ['Сжатие диапазонов', 'Линейный проход'], 3, 'transfer', 'stretch', ['s03-l02'], 'Поддерживайте начало текущего непрерывного отрезка и корректно завершайте его на границе массива.'),
  k('521c2db8ddc89b9b7a0000c1', 'Snail', 'snail', '4 kyu', ['Матрица', 'Границы обхода'], 13, 'independent', 'stretch', ['s13-l01'], 'Сжимайте четыре границы после каждого направления и не посещайте клетку дважды.'),
  k('5324945e2ece5e1f32000370', 'Sum Strings as Numbers', 'sum-strings-as-numbers', '4 kyu', ['Строковая арифметика', 'Перенос разряда'], 2, 'independent', 'stretch', ['s02-l01'], 'Складывайте справа налево, поддерживая перенос и аккуратно обрабатывая разные длины и ведущие нули.'),
];

export const codewarsKata: CodewarsKata[] = drafts.map((kata) => ({
  ...kata,
  url: `https://www.codewars.com/kata/${kata.id}`,
  provider: 'Codewars',
  verifiedAt: CODEWARS_PROVENANCE.verifiedAt,
  supportedLanguages: ['cpp', 'python'],
}));
