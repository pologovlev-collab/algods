import type { PracticeMode, PracticeTier } from '../lib/practice';

export type CodewarsRank = '8 kyu' | '7 kyu' | '6 kyu' | '5 kyu' | '4 kyu';

export interface CodewarsKata {
  id: string;
  title: string;
  slug: string;
  url: string;
  provider: 'Codewars';
  verifiedAt: '2026-09-01';
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
  verifiedAt: '2026-09-01',
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
  k('5168bb5dfe9a00b126000018', 'Reversed Strings', 'reversed-strings', '8 kyu', ['Строки', 'Обратный проход'], 2, 'guided', 'warm-up', ['s02-l01'], 'Разверните строку ясным проходом и сравните решение с готовой операцией языка.'),
  k('5715eaedb436cf5606000381', 'Sum of positive', 'sum-of-positive', '8 kyu', ['Линейный проход', 'Фильтрация'], 2, 'guided', 'warm-up', ['s02-l01'], 'Совместите условие отбора и накопление ответа в одном читаемом проходе.'),
  k('55a2d7ebe362935a210000b2', 'Find the smallest integer in the array', 'find-the-smallest-integer-in-the-array', '8 kyu', ['Линейный проход', 'Минимум'], 2, 'guided', 'warm-up', ['s02-l01'], 'Зафиксируйте корректную инициализацию минимума и обновляйте его ровно при улучшении.'),
  k('54edbc7200b811e956000556', 'Counting sheep...', 'counting-sheep-dot-dot-dot', '8 kyu', ['Линейный проход', 'Подсчёт'], 2, 'guided', 'warm-up', ['s02-l01'], 'Считайте только элементы, удовлетворяющие предикату, не смешивая значение и его позицию.'),
  k('515e271a311df0350d00000f', 'Square(n) Sum', 'square-n-sum', '8 kyu', ['Линейный проход', 'Агрегация'], 2, 'guided', 'warm-up', ['s02-l01'], 'Разделите преобразование элемента и накопление общей суммы.'),
  k('57a0e5c372292dd76d000d7e', 'String repeat', 'string-repeat', '8 kyu', ['Строки', 'Построение ответа'], 2, 'guided', 'warm-up', ['s02-l01'], 'Оцените стоимость последовательного построения строки и используйте естественную операцию языка.'),
  k('54ff3102c1bad923760001f3', 'Vowel Count', 'vowel-count', '7 kyu', ['Строки', 'Множество символов'], 2, 'transfer', 'warm-up', ['s02-l02'], 'Представьте набор гласных структурой для быстрой проверки принадлежности.'),
  k('554b4ac871d6813a03000035', 'Highest and Lowest', 'highest-and-lowest', '7 kyu', ['Парсинг', 'Минимум и максимум'], 2, 'transfer', 'warm-up', ['s02-l01'], 'Отделите разбор входной строки от одного прохода с двумя агрегатами.'),
  k('56747fd5cb988479af000028', 'Get the Middle Character', 'get-the-middle-character', '7 kyu', ['Строки', 'Индексы'], 2, 'guided', 'warm-up', ['s02-l01'], 'Выведите формулу центрального диапазона отдельно для чётной и нечётной длины.'),
  k('54ba84be607a92aa900000f1', 'Isograms', 'isograms', '7 kyu', ['Hash set', 'Повторы'], 2, 'transfer', 'warm-up', ['s02-l02'], 'Остановитесь при первом повторе и явно нормализуйте регистр перед проверкой.'),
  k('529eef7a9194e0cbc1000255', 'Anagram Detection', 'anagram-detection', '7 kyu', ['Частоты', 'Строки'], 2, 'transfer', 'standard', ['s02-l03'], 'Сравните частотные представления вместо перебора возможных перестановок.'),
  k('558fc85d8fd1938afb000014', 'Sum of two lowest positive integers', 'sum-of-two-lowest-positive-integers', '7 kyu', ['Два минимума', 'Сортировка'], 7, 'transfer', 'standard', ['s07-l01'], 'Сравните полную сортировку с одним проходом, который хранит два лучших кандидата.'),
  k('5656b6906de340bd1b0000ac', 'Two to One', 'two-to-one', '7 kyu', ['Множества', 'Сортировка'], 2, 'transfer', 'warm-up', ['s02-l02'], 'Сначала устраните дубликаты множеством, затем отдельно обеспечьте порядок результата.'),
  k('56269eb78ad2e4ced1000013', 'Find the next perfect square!', 'find-the-next-perfect-square', '7 kyu', ['Проверка кандидата', 'Границы чисел'], 0, 'independent', 'standard', ['s00-l03'], 'Проверьте целочисленность корня без хрупкого сравнения вещественных значений.'),
  k('5467e4d82edf8bbf40000155', 'Descending Order', 'descending-order', '7 kyu', ['Сортировка', 'Цифры'], 7, 'guided', 'warm-up', ['s07-l01'], 'Преобразуйте число в последовательность цифр и явно задайте направление сортировки.'),
  k('57cebe1dc6fdc20c57000ac9', 'Shortest Word', 'shortest-word', '7 kyu', ['Токенизация', 'Минимум'], 2, 'guided', 'warm-up', ['s02-l01'], 'Обновляйте минимальную длину во время чтения слов, не сохраняя лишние данные.'),
  k('563b662a59afc2b5120000c6', 'Growth of a Population', 'growth-of-a-population', '7 kyu', ['Моделирование', 'Цикл'], 0, 'transfer', 'standard', ['s00-l02'], 'Сформулируйте условие завершения и проверьте порядок процентного и абсолютного прироста.'),
  k('54da5a58ea159efa38000836', 'Find the odd int', 'find-the-odd-int', '6 kyu', ['XOR', 'Частоты'], 18, 'transfer', 'standard', ['s18-l02'], 'Сравните частотный словарь с XOR-инвариантом и объясните ограничения второго подхода.'),
  k('54bf1c2cd5b56cc47f0007a1', 'Counting Duplicates', 'counting-duplicates', '6 kyu', ['Частоты', 'Нормализация'], 2, 'transfer', 'standard', ['s02-l03'], 'Нормализуйте регистр до подсчёта и считайте значения, а не число повторных появлений.'),
  k('54b42f9314d9229fd6000d9c', 'Duplicate Encoder', 'duplicate-encoder', '6 kyu', ['Частоты', 'Преобразование строки'], 2, 'independent', 'standard', ['s02-l03'], 'Сначала соберите глобальные частоты, затем преобразуйте каждый символ по готовому контексту.'),
  k('578aa45ee9fd15ff4600090d', 'Sort the odd', 'sort-the-odd', '6 kyu', ['Сортировка', 'Стабильное размещение'], 7, 'independent', 'standard', ['s07-l01'], 'Отделите выбираемые значения от фиксированных позиций и верните их в отсортированном порядке.'),
  k('5277c8a221e209d3f6000b56', 'Valid Braces', 'valid-braces', '6 kyu', ['Стек', 'Скобочная последовательность'], 6, 'transfer', 'standard', ['s06-l01'], 'Храните только незакрытые открывающие скобки и отклоняйте первое несовместимое закрытие.'),
  k('54e6533c92449cc251001667', 'Unique In Order', 'unique-in-order', '6 kyu', ['Два указателя', 'Удаление соседних дублей'], 3, 'guided', 'warm-up', ['s03-l02'], 'Сравнивайте элемент только с последним добавленным результатом, а не со всем префиксом.'),
  k('545cedaa9943f7fe7b000048', 'Detect Pangram', 'detect-pangram', '6 kyu', ['Hash set', 'Покрытие алфавита'], 2, 'transfer', 'standard', ['s02-l02'], 'Нормализуйте буквы и проверяйте полноту множества, игнорируя посторонние символы.'),
  k('52597aa56021e91c93000cb0', 'Moving Zeros To The End', 'moving-zeros-to-the-end', '5 kyu', ['Два указателя', 'Стабильная фильтрация'], 3, 'transfer', 'standard', ['s03-l02'], 'Сохраняйте относительный порядок ненулевых элементов и отделяйте запись от чтения.'),
  k('550f22f4d758534c1100025a', 'Directions Reduction', 'directions-reduction', '5 kyu', ['Стек', 'Сокращение последовательности'], 6, 'independent', 'standard', ['s06-l01'], 'Удаляйте взаимно обратные соседние шаги сразу, поддерживая несокращаемый префикс.'),
  k('5541f58a944b85ce6d00006a', 'Product of consecutive Fib numbers', 'product-of-consecutive-fib-numbers', '5 kyu', ['Последовательности', 'Линейный поиск'], 2, 'transfer', 'standard', ['s02-l01'], 'Генерируйте соседние числа Фибоначчи до пересечения целевого произведения без полного списка.'),
  k('541c8630095125aba6000c00', 'Sum of Digits / Digital Root', 'sum-of-digits-slash-digital-root', '6 kyu', ['Цифры', 'Повторное сокращение'], 2, 'independent', 'standard', ['s02-l01'], 'Сформулируйте повторяемое преобразование и проверьте однозначное условие остановки.'),
  k('55bf01e5a717a0d57e0000ec', 'Persistent Bugger.', 'persistent-bugger', '6 kyu', ['Цифры', 'Итерация'], 2, 'independent', 'standard', ['s02-l01'], 'Считайте число преобразований отдельно от самого текущего значения.'),
  k('530e15517bc88ac656000716', 'Rot13', 'rot13-1', '5 kyu', ['Строки', 'Циклическое отображение'], 2, 'independent', 'standard', ['s02-l01'], 'Отображайте буквы внутри каждого регистра по модулю длины алфавита, сохраняя прочие символы.'),
  k('520b9d2ad5c005041100000f', 'Simple Pig Latin', 'simple-pig-latin', '5 kyu', ['Токенизация', 'Преобразование строк'], 2, 'independent', 'standard', ['s02-l01'], 'Разделите классификацию токена и его преобразование, не повреждая пунктуацию.'),
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
