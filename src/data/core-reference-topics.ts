export type CoreReferenceCategoryId = 'core-patterns' | 'data-structures';

export interface CoreReferenceTopic {
  patternId: string;
  lessonId: string;
  category: CoreReferenceCategoryId;
  aliases: string[];
  complexity: string[];
  pitfalls: string[];
}

export const coreReferenceTopics: CoreReferenceTopic[] = [
  {
    patternId: 'problem-solving', lessonId: 's00-l02', category: 'core-patterns',
    aliases: ['problem solving', 'brute force', 'перебор', 'оценка решения'],
    complexity: ['Собственной сложности нет: сначала считают кандидатов и работу на одного кандидата, затем перемножают оценки.'],
    pitfalls: ['Нельзя отбрасывать медленный эталон до того, как сформулирован его контракт и найдено конкретное повторение работы.'],
  },
  {
    patternId: 'linear-scan', lessonId: 's02-l01', category: 'core-patterns',
    aliases: ['linear scan', 'array traversal', 'линейный проход', 'обход массива'],
    complexity: ['Один проход по n элементам: O(n) времени; дополнительная память O(1), если состояние имеет постоянный размер.'],
    pitfalls: ['Состояние префикса должно обновляться за O(1); пересчёт уже пройденной части превращает решение в O(n²).'],
  },
  {
    patternId: 'two-pointers', lessonId: 's03-l01', category: 'core-patterns',
    aliases: ['two pointers', 'два указателя', 'left right', 'fast slow'],
    complexity: ['Если каждый указатель движется только вперёд или внутрь диапазона, суммарное время O(n), память O(1).'],
    pitfalls: ['Сдвиг границы корректен только при доказанном монотонном эффекте; на произвольном порядке данных он может потерять ответ.'],
  },
  {
    patternId: 'sliding-window', lessonId: 's04-l02', category: 'core-patterns',
    aliases: ['sliding window', 'скользящее окно', 'окно', 'two pointers window'],
    complexity: ['При монотонных расширении и сжатии каждая граница проходит массив один раз: O(n) времени; память зависит от состояния окна.'],
    pitfalls: ['Нужно точно определить, когда окно допустимо и как удаление левого элемента восстанавливает инвариант.'],
  },
  {
    patternId: 'prefix-sum', lessonId: 's05-l01', category: 'core-patterns',
    aliases: ['prefix sum', 'префиксная сумма', 'prefix counts', 'префиксные счётчики'],
    complexity: ['Построение O(n) времени и O(n) памяти; запрос суммы или счётчика полуинтервала после подготовки — O(1).'],
    pitfalls: ['Массив префиксов обычно имеет n + 1 элемент; смешение [l, r) и [l, r] даёт ошибку на границе.'],
  },
  {
    patternId: 'sorting', lessonId: 's07-l01', category: 'core-patterns',
    aliases: ['sorting', 'sort', 'сортировка', 'упорядочивание'],
    complexity: ['Сравнительная сортировка общего назначения обычно требует O(n log n) времени; дополнительная память зависит от алгоритма и реализации.'],
    pitfalls: ['Сортировка меняет исходный порядок: заранее проверьте, нужны ли исходные индексы и допустима ли мутация входа.'],
  },
  {
    patternId: 'intervals', lessonId: 's07-l03', category: 'core-patterns',
    aliases: ['intervals', 'merge intervals', 'интервалы', 'отрезки'],
    complexity: ['Сортировка n интервалов занимает O(n log n), последующий линейный проход — O(n); результат может занять O(n).'],
    pitfalls: ['Сначала зафиксируйте модель границ: касающиеся [a, b] и [b, c] могут пересекаться или не пересекаться по контракту задачи.'],
  },
  {
    patternId: 'binary-search', lessonId: 's08-l01', category: 'core-patterns',
    aliases: ['binary search', 'lower bound', 'бинарный поиск', 'двоичный поиск'],
    complexity: ['Поиск по индексируемому упорядоченному пространству: O(log n) времени и O(1) памяти в итеративной форме.'],
    pitfalls: ['Контракт границ и монотонность предиката важнее формулы mid; смешение закрытого диапазона и полуинтервала вызывает зависание или off-by-one.'],
  },
  {
    patternId: 'backtracking', lessonId: 's12-l01', category: 'core-patterns',
    aliases: ['backtracking', 'бэктрекинг', 'choose recurse undo', 'дерево решений'],
    complexity: ['В общем случае время экспоненциально — порядка O(b^d) для ветвления b и глубины d; стек и текущее состояние занимают O(d).'],
    pitfalls: ['Каждое изменение состояния перед рекурсией должно быть симметрично отменено; иначе соседние ветви получают чужие решения.'],
  },
  {
    patternId: 'graph', lessonId: 's13-l01', category: 'core-patterns',
    aliases: ['graph traversal', 'граф', 'dfs', 'bfs', 'список смежности'],
    complexity: ['DFS и BFS по спискам смежности: O(V + E) времени и O(V) дополнительной памяти, не считая хранения графа.'],
    pitfalls: ['В ориентированном и неориентированном графах рёбра добавляются по-разному; visited отмечают в момент обнаружения, чтобы не раздувать очередь.'],
  },
  {
    patternId: 'topological-sort', lessonId: 's13-l04', category: 'core-patterns',
    aliases: ['topological sort', 'kahn algorithm', 'топологическая сортировка', 'порядок зависимостей'],
    complexity: ['Алгоритм Кана и DFS-вариант работают за O(V + E) времени и используют O(V) дополнительной памяти.'],
    pitfalls: ['Если в ответ вошло меньше V вершин, граф содержит цикл; частичный порядок нельзя выдавать как корректное расписание.'],
  },
  {
    patternId: 'shortest-path', lessonId: 's13-l03', category: 'core-patterns',
    aliases: ['shortest path', 'кратчайший путь', 'bfs distance', 'dijkstra', 'дейкстра'],
    complexity: ['BFS для невзвешенного графа: O(V + E); Дейкстра с двоичной кучей и неотрицательными весами: O((V + E) log V).'],
    pitfalls: ['Алгоритм выбирают по модели веса: обычный BFS не учитывает разные стоимости, а Дейкстра некорректен при отрицательных рёбрах.'],
  },
  {
    patternId: 'greedy', lessonId: 's14-l01', category: 'core-patterns',
    aliases: ['greedy', 'жадный алгоритм', 'exchange argument', 'обменный аргумент'],
    complexity: ['Цена зависит от выбора кандидата; типичная схема с предварительной сортировкой занимает O(n log n) времени.'],
    pitfalls: ['Локально привлекательный шаг не достаточен: нужен обменный аргумент или другой инвариант, связывающий его с глобальным оптимумом.'],
  },
  {
    patternId: 'dynamic-programming', lessonId: 's15-l01', category: 'core-patterns',
    aliases: ['dynamic programming', 'dp', 'динамическое программирование', 'мемоизация'],
    complexity: ['Время обычно равно числу достижимых состояний, умноженному на число переходов; память — числу хранимых состояний.'],
    pitfalls: ['Состояние должно содержать всю информацию для будущего и не хранить лишнюю историю; порядок вычисления обязан уважать зависимости.'],
  },
  {
    patternId: 'bit-manipulation', lessonId: 's18-l01', category: 'core-patterns',
    aliases: ['bit manipulation', 'bitmask', 'битовые операции', 'битовая маска', 'xor'],
    complexity: ['Операция над машинным словом считается O(1); перебор всех масок n элементов требует O(2ⁿ), а просмотр битов каждой маски — O(n · 2ⁿ).'],
    pitfalls: ['Сдвиг, знаковость и ширина типа зависят от языка; перед 1 << k проверяйте допустимый диапазон k и нужный тип.'],
  },
  {
    patternId: 'hashing', lessonId: 's02-l02', category: 'data-structures',
    aliases: ['hash table', 'hash map', 'hash set', 'хеш-таблица', 'словарь', 'множество'],
    complexity: ['Поиск, вставка и удаление ожидаемо O(1), в худшем случае O(n); память O(n).'],
    pitfalls: ['Ожидаемая O(1) не является гарантией худшего случая; изменяемые ключи и несогласованные hash/equality нарушают поиск.'],
  },
  {
    patternId: 'stack', lessonId: 's06-l01', category: 'data-structures',
    aliases: ['stack', 'lifo', 'стек'],
    complexity: ['push, pop и чтение вершины — O(1); память O(n) для n сохранённых элементов.'],
    pitfalls: ['Перед чтением или удалением вершины проверяйте пустоту; в задачах со скобками дополнительно сверяйте тип пары.'],
  },
  {
    patternId: 'queue', lessonId: 's06-l02', category: 'data-structures',
    aliases: ['queue', 'deque', 'fifo', 'очередь', 'дек'],
    complexity: ['Добавление и удаление на поддерживаемых концах очереди или дека — O(1); память O(n).'],
    pitfalls: ['Python list.pop(0) и удаление начала vector требуют O(n); для очереди нужен deque или специализированный контейнер.'],
  },
  {
    patternId: 'monotonic-structure', lessonId: 's06-l03', category: 'data-structures',
    aliases: ['monotonic stack', 'monotonic deque', 'монотонный стек', 'монотонный дек'],
    complexity: ['Каждый элемент добавляется и удаляется не более одного раза: O(n) времени и O(n) памяти в худшем случае.'],
    pitfalls: ['Направление монотонности и политика равных значений определяют, ищется ли строго больший или не меньший элемент.'],
  },
  {
    patternId: 'linked-list', lessonId: 's09-l01', category: 'data-structures',
    aliases: ['linked list', 'singly linked list', 'связный список', 'односвязный список'],
    complexity: ['Доступ по позиции и поиск — O(n); вставка или удаление после известного узла — O(1); память O(n).'],
    pitfalls: ['Перед сменой next сохраните остаток цепочки; иначе часть списка становится недостижимой.'],
  },
  {
    patternId: 'tree', lessonId: 's10-l01', category: 'data-structures',
    aliases: ['tree', 'binary tree', 'дерево', 'бинарное дерево', 'dfs tree'],
    complexity: ['Полный DFS или BFS дерева: O(n) времени; память O(h) для рекурсивного DFS и до O(w) для BFS, где h — высота, w — ширина.'],
    pitfalls: ['Не путайте структурное бинарное дерево с BST: упорядочивающий инвариант существует только при явном условии.'],
  },
  {
    patternId: 'heap', lessonId: 's11-l01', category: 'data-structures',
    aliases: ['heap', 'priority queue', 'куча', 'приоритетная очередь'],
    complexity: ['Чтение экстремума O(1), вставка и удаление экстремума O(log n), построение heapify O(n), память O(n).'],
    pitfalls: ['Куча гарантирует только вершину, а не полный порядок; min-heap и max-heap требуют согласованного компаратора.'],
  },
  {
    patternId: 'disjoint-set', lessonId: 's13-l05', category: 'data-structures',
    aliases: ['disjoint set union', 'union find', 'dsu', 'система непересекающихся множеств'],
    complexity: ['Сжатие путей и объединение по рангу дают амортизированное O(α(n)) на find/union; память O(n).'],
    pitfalls: ['DSU поддерживает объединения, но не обычные удаления рёбер и не хранит сам путь между вершинами.'],
  },
  {
    patternId: 'trie', lessonId: 's17-l01', category: 'data-structures',
    aliases: ['trie', 'prefix tree', 'бор', 'префиксное дерево'],
    complexity: ['Вставка и поиск слова длины L занимают O(L); память пропорциональна числу созданных переходов.'],
    pitfalls: ['Признак terminal обязателен: существующий путь префикса ещё не означает, что полное слово было добавлено.'],
  },
];
