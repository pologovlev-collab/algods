export interface ReferenceDeepDive {
  id: string;
  title: string;
  mentalModel: string;
  invariant: string;
  mechanics: string[];
  chooseWhen: string[];
  codeExamples?: ReferenceCodeExample[];
}

export interface ReferenceCodeExample {
  language: 'cpp' | 'python';
  label: string;
  code: string;
}

export interface ReferenceTopic {
  id: string;
  slug: string;
  title: string;
  aliases: string[];
  group: 'sorting' | 'trees' | 'graphs' | 'strings' | 'dp' | 'math' | 'techniques';
  prerequisites: string[];
  core: false;
  scope: string;
  useWhen: string;
  decisionNotes: string[];
  complexity: string[];
  pitfalls: string[];
  deepDives?: ReferenceDeepDive[];
}

export const referenceTopics: ReferenceTopic[] = [
  {
    id: 'ref-classic-sorts',
    slug: 'classic-sorting-algorithms',
    title: 'Классические сортировки',
    aliases: ['non-comparison sorting', 'counting sort', 'radix sort', 'сортировка подсчётом', 'поразрядная сортировка'],
    group: 'sorting',
    prerequisites: ['s07-l01'],
    core: false,
    scope: 'Bubble, selection, heap, counting, radix и их точные области применимости.',
    useWhen: 'Когда нужно выбрать сортировку под ограничения на память, стабильность и диапазон ключей, а не просто вызвать библиотечную функцию.',
    decisionNotes: [
      'Bubble и selection уместны прежде всего для разбора инвариантов и очень малых входов; selection делает лишь O(n) обменов, а bubble с флагом умеет рано остановиться.',
      'Heap sort даёт гарантированное O(n log n) и O(1) дополнительной памяти, но не сохраняет порядок равных элементов.',
      'Counting sort выбирают для целых ключей из небольшого известного диапазона; стабильный вариант позволяет сортировать записи по ключу.',
      'Radix sort обрабатывает ключи по разрядам и требует стабильной сортировки каждого разряда; выгоден, когда число разрядов и основание контролируемы.',
    ],
    complexity: [
      'Bubble: O(n²) в среднем и худшем случае, O(n) в лучшем с ранней остановкой; память O(1). Selection: всегда O(n²), память O(1).',
      'Heap sort: построение кучи O(n), вся сортировка O(n log n), дополнительная память O(1).',
      'Counting sort: O(n + k) времени; для подсчёта только значений достаточно O(k) дополнительной памяти, а стабильный вариант для записей требует O(n + k) памяти на выход и частоты, где k — размер диапазона ключей.',
      'Radix sort: O(d · (n + b)) времени и O(n + b) памяти для d разрядов и основания b.',
    ],
    pitfalls: [
      'Counting sort становится непрактичным, если диапазон ключей намного больше входа или его границы заранее неизвестны.',
      'Нестабильная сортировка разряда нарушает корректность radix sort.',
      'Heap sort и selection sort нестабильны без дополнительных приёмов; это важно для записей с равными ключами.',
      'Оценка radix sort не означает безусловное O(n): число разрядов зависит от представления и диапазона ключей.',
    ],
  },
  {
    id: 'ref-range-trees',
    slug: 'range-query-trees',
    title: 'Fenwick и дерево отрезков',
    aliases: ['range queries', 'fenwick tree', 'segment tree', 'дерево Фенвика', 'дерево отрезков'],
    group: 'trees',
    prerequisites: ['s05-l01', 's10-l01'],
    core: false,
    scope: 'Изменяемые префиксы и запросы на диапазоне.',
    useWhen: 'Когда массив меняется между запросами и пересчитывать префиксы или весь диапазон после каждого обновления слишком дорого.',
    decisionNotes: [
      'Fenwick проще и компактнее для точечных изменений и префиксных сумм; произвольная сумма [l, r] получается разностью двух префиксов.',
      'Дерево отрезков выбирают для произвольной ассоциативной операции с нейтральным элементом: суммы, минимума, максимума или составного состояния.',
      'Ленивое распространение нужно, когда и обновления, и запросы покрывают диапазоны; отложенная операция должна корректно действовать на агрегат узла.',
      'Сжатие координат помогает при разреженных индексах, если важен их порядок, но само по себе не превращает запросы по значениям в запросы по исходным координатам.',
    ],
    complexity: [
      'Fenwick: префиксный запрос и точечное обновление O(log n), память O(n); специальное построение возможно за O(n).',
      'Обычное дерево отрезков: построение O(n), запрос диапазона и точечное обновление O(log n), память O(n).',
      'Дерево отрезков с lazy propagation: диапазонный запрос и совместимое диапазонное обновление O(log n) для стандартных операций, память O(n).',
    ],
    pitfalls: [
      'Fenwick обычно индексируется с единицы: обновление индекса 0 зациклится, если не отделить внешнюю индексацию от внутренней.',
      'Разность префиксов работает не для любой операции; для минимума обратной операции нет.',
      'Ошибочная длина сегмента или порядок композиции lazy-тегов портит агрегаты после пересекающихся обновлений.',
      'Несогласованные полуинтервалы и замкнутые отрезки дают ошибки на границах.',
      'В референсном C++ коде суммы должны помещаться в long long. Python int расширяется автоматически, но стоимость арифметики растёт вместе с числом разрядов.',
    ],
    deepDives: [
      {
        id: 'fenwick-tree',
        title: 'Дерево Фенвика: префиксы через двоичные блоки',
        mentalModel: 'Вместо явного дерева хранится массив частичных сумм. Ячейка с внутренним индексом i отвечает за блок, который заканчивается в i и имеет длину lowbit(i) = i & -i. Эти блоки позволяют разложить любой префикс на O(log n) непересекающихся частей.',
        invariant: 'tree[i] равен сумме элементов на внутренних индексах от i - lowbit(i) + 1 до i включительно. Внешние индексы 0..n-1 переводятся во внутренние 1..n.',
        mechanics: [
          'Точечное обновление добавляет delta сначала в блок текущего элемента, затем в каждый более крупный блок, который его содержит: i += i & -i.',
          'Префиксная сумма движется в обратную сторону: добавляет текущий блок и удаляет младший установленный бит через i -= i & -i, пока индекс не станет нулём.',
          'Сумма полуинтервала [left, right) получается как prefix(right) - prefix(left). Разность корректна для суммы, потому что у сложения есть обратная операция.',
          'Память остаётся линейной, а обновление и префиксный запрос проходят не больше числа битов индекса: O(log n).',
        ],
        chooseWhen: [
          'Выбирайте Fenwick для точечных изменений и префиксных или диапазонных сумм, когда нужен компактный код и не требуется хранить сложное состояние сегмента.',
          'Не переносите формулу разности на минимум или максимум: у этих операций нет обратного элемента, который удаляет левый префикс.',
        ],
        codeExamples: [
          {
            language: 'cpp',
            label: 'C++17: точечное добавление и сумма [left, right)',
            code: String.raw`#include <iostream>
#include <stdexcept>
#include <vector>

class FenwickTree {
public:
    explicit FenwickTree(int size) {
        if (size < 0) {
            throw std::invalid_argument("size must be non-negative");
        }
        tree_.assign(static_cast<std::size_t>(size) + 1, 0);
    }

    void add(int index, long long delta) {
        check_index(index);
        for (int i = index + 1; i < static_cast<int>(tree_.size()); i += i & -i) {
            tree_[i] += delta;
        }
    }

    long long prefix_sum(int end) const {
        if (end < 0 || end >= static_cast<int>(tree_.size())) {
            throw std::out_of_range("end is outside [0, size]");
        }
        long long result = 0;
        for (int i = end; i > 0; i -= i & -i) {
            result += tree_[i];
        }
        return result;
    }

    long long range_sum(int left, int right) const {
        if (left < 0 || left > right || right >= static_cast<int>(tree_.size())) {
            throw std::out_of_range("invalid half-open range");
        }
        return prefix_sum(right) - prefix_sum(left);
    }

private:
    std::vector<long long> tree_;

    void check_index(int index) const {
        if (index < 0 || index + 1 >= static_cast<int>(tree_.size())) {
            throw std::out_of_range("index is outside the array");
        }
    }
};

int main() {
    std::vector<int> values{3, -1, 4, 1, 5};
    FenwickTree fenwick(static_cast<int>(values.size()));
    for (int i = 0; i < static_cast<int>(values.size()); ++i) {
        fenwick.add(i, values[i]);
    }

    std::cout << fenwick.prefix_sum(0) << '\n';
    std::cout << fenwick.range_sum(0, static_cast<int>(values.size())) << '\n';
    std::cout << fenwick.range_sum(1, 4) << '\n';
    fenwick.add(2, 6);
    std::cout << fenwick.range_sum(1, 4) << '\n';
}`,
          },
          {
            language: 'python',
            label: 'Python 3: тот же контракт полуинтервала',
            code: String.raw`class FenwickTree:
    def __init__(self, size: int) -> None:
        if size < 0:
            raise ValueError("size must be non-negative")
        self._tree = [0] * (size + 1)

    def add(self, index: int, delta: int) -> None:
        self._check_index(index)
        i = index + 1
        while i < len(self._tree):
            self._tree[i] += delta
            i += i & -i

    def prefix_sum(self, end: int) -> int:
        if not 0 <= end < len(self._tree):
            raise IndexError("end is outside [0, size]")
        result = 0
        i = end
        while i > 0:
            result += self._tree[i]
            i -= i & -i
        return result

    def range_sum(self, left: int, right: int) -> int:
        if not 0 <= left <= right < len(self._tree):
            raise IndexError("invalid half-open range")
        return self.prefix_sum(right) - self.prefix_sum(left)

    def _check_index(self, index: int) -> None:
        if not 0 <= index < len(self._tree) - 1:
            raise IndexError("index is outside the array")


values = [3, -1, 4, 1, 5]
fenwick = FenwickTree(len(values))
for index, value in enumerate(values):
    fenwick.add(index, value)

print(fenwick.prefix_sum(0))
print(fenwick.range_sum(0, len(values)))
print(fenwick.range_sum(1, 4))
fenwick.add(2, 6)
print(fenwick.range_sum(1, 4))`,
          },
        ],
      },
      {
        id: 'segment-tree',
        title: 'Дерево отрезков: иерархия агрегатов',
        mentalModel: 'Корень отвечает за весь массив, его дети — за две половины, а листья — за отдельные элементы. Запрос разбивается на небольшое число узлов, чьи интервалы целиком лежат внутри нужного диапазона.',
        invariant: 'Каждый узел хранит combine агрегатов двух детей и точно описывает свой полуинтервал. Операция combine должна быть ассоциативной, а пустому пересечению нужен нейтральный элемент.',
        mechanics: [
          'Построение создаёт листья из элементов и пересчитывает внутренние узлы снизу вверх за O(n). В референсной итеративной форме база листьев округляется до следующей степени двойки: так каждый узел остаётся одним непрерывным полуинтервалом, а массив занимает меньше 4n ячеек.',
          'Точечное обновление меняет один лист и пересчитывает O(log n) предков. Запрос [left, right) поднимает границы вверх и добавляет только полностью покрытые узлы.',
          'Рекурсивная запись явно показывает интервалы и проще расширяется; итеративная обычно компактнее и экономит служебный стек для точечных обновлений и диапазонных запросов.',
          'Lazy propagation хранит отложенную операцию у целого сегмента и передаёт её детям только перед частичным спуском. Это отдельное усложнение для диапазонных обновлений, а не обязательная часть обычного дерева.',
        ],
        chooseWhen: [
          'Выбирайте дерево отрезков, если нужен минимум, максимум, НОД или составной агрегат, либо в будущем появятся диапазонные обновления.',
          'Сначала сформулируйте combine, нейтральный элемент и действие обновления на агрегат; без этого структура не определена.',
        ],
        codeExamples: [
          {
            language: 'cpp',
            label: 'C++17: итеративное дерево сумм',
            code: String.raw`#include <iostream>
#include <stdexcept>
#include <vector>

class SegmentTree {
public:
    explicit SegmentTree(const std::vector<int>& values)
        : size_(static_cast<int>(values.size())) {
        while (capacity_ < size_) {
            capacity_ *= 2;
        }
        tree_.assign(2 * capacity_, 0);
        for (int i = 0; i < size_; ++i) {
            tree_[capacity_ + i] = values[i];
        }
        for (int i = capacity_ - 1; i > 0; --i) {
            tree_[i] = tree_[2 * i] + tree_[2 * i + 1];
        }
    }

    void set(int index, long long value) {
        check_index(index);
        int position = index + capacity_;
        tree_[position] = value;
        for (position /= 2; position > 0; position /= 2) {
            tree_[position] = tree_[2 * position] + tree_[2 * position + 1];
        }
    }

    long long range_sum(int left, int right) const {
        if (left < 0 || left > right || right > size_) {
            throw std::out_of_range("invalid half-open range");
        }
        long long left_result = 0;
        long long right_result = 0;
        for (left += capacity_, right += capacity_; left < right; left /= 2, right /= 2) {
            if (left % 2 == 1) {
                left_result += tree_[left++];
            }
            if (right % 2 == 1) {
                right_result = tree_[--right] + right_result;
            }
        }
        return left_result + right_result;
    }

private:
    int size_;
    int capacity_ = 1;
    std::vector<long long> tree_;

    void check_index(int index) const {
        if (index < 0 || index >= size_) {
            throw std::out_of_range("index is outside the array");
        }
    }
};

int main() {
    SegmentTree tree({2, 1, 5, 3, 4});
    std::cout << tree.range_sum(0, 0) << '\n';
    std::cout << tree.range_sum(0, 5) << '\n';
    std::cout << tree.range_sum(1, 5) << '\n';
    tree.set(2, 8);
    std::cout << tree.range_sum(1, 5) << '\n';
}`,
          },
          {
            language: 'python',
            label: 'Python 3: итеративное дерево сумм',
            code: String.raw`class SegmentTree:
    def __init__(self, values: list[int]) -> None:
        self._size = len(values)
        self._capacity = 1
        while self._capacity < self._size:
            self._capacity *= 2
        self._tree = [0] * (2 * self._capacity)
        self._tree[self._capacity:self._capacity + self._size] = values
        for index in range(self._capacity - 1, 0, -1):
            self._tree[index] = self._tree[2 * index] + self._tree[2 * index + 1]

    def set(self, index: int, value: int) -> None:
        self._check_index(index)
        position = index + self._capacity
        self._tree[position] = value
        position //= 2
        while position > 0:
            self._tree[position] = self._tree[2 * position] + self._tree[2 * position + 1]
            position //= 2

    def range_sum(self, left: int, right: int) -> int:
        if not 0 <= left <= right <= self._size:
            raise IndexError("invalid half-open range")
        left_result = 0
        right_result = 0
        left += self._capacity
        right += self._capacity
        while left < right:
            if left % 2 == 1:
                left_result += self._tree[left]
                left += 1
            if right % 2 == 1:
                right -= 1
                right_result = self._tree[right] + right_result
            left //= 2
            right //= 2
        return left_result + right_result

    def _check_index(self, index: int) -> None:
        if not 0 <= index < self._size:
            raise IndexError("index is outside the array")


tree = SegmentTree([2, 1, 5, 3, 4])
print(tree.range_sum(0, 0))
print(tree.range_sum(0, 5))
print(tree.range_sum(1, 5))
tree.set(2, 8)
print(tree.range_sum(1, 5))`,
          },
        ],
      },
      {
        id: 'range-query-selection',
        title: 'Как выбрать структуру для запросов на диапазоне',
        mentalModel: 'Выбор определяется не названием задачи, а двумя осями: меняется ли массив и какая операция объединяет части ответа. Самая простая структура, которая покрывает контракт, обычно даёт меньше ошибок.',
        invariant: 'Подготовка и обновления должны сохранять именно тот агрегат, который запрашивает задача; асимптотика имеет смысл только вместе с числом запросов и изменений.',
        mechanics: [
          'Для неизменяемых сумм используйте префиксные суммы: O(n) подготовка и O(1) на запрос.',
          'Для неизменяемой идемпотентной операции вроде минимума и очень многих запросов подходит sparse table: O(n log n) подготовка, O(1) запрос, но без дешёвых обновлений.',
          'Для точечных изменений и сумм Fenwick даёт O(log n) с меньшим кодом и константами. Для более общего combine берите дерево отрезков.',
          'Диапазонные обновления требуют отдельной техники: разностного массива в пакетном сценарии, пары Fenwick для некоторых сумм или lazy propagation в дереве отрезков.',
        ],
        chooseWhen: [
          'Сравните число запросов, число обновлений, тип операции, ограничения памяти и допустимую сложность реализации до выбора структуры.',
        ],
      },
    ],
  },
  {
    id: 'ref-lca-balanced',
    slug: 'lca-and-balanced-trees',
    title: 'LCA и сбалансированные деревья',
    aliases: ['lowest common ancestor', 'lca', 'binary lifting', 'avl', 'red-black tree', 'ordered set', 'наименьший общий предок', 'двоичные подъёмы', 'сбалансированное дерево'],
    group: 'trees',
    prerequisites: ['s10-l04'],
    core: false,
    scope: 'Предки, AVL и красно-чёрные деревья на уровне корректных инвариантов.',
    useWhen: 'Для большого числа запросов о предках в статическом дереве или для словаря, где высота дерева поиска должна оставаться логарифмической после обновлений.',
    decisionNotes: [
      'Binary lifting удобен для LCA и подъёма вершины на k уровней: таблица предков строится один раз для статического дерева.',
      'Euler tour с RMQ сводит LCA к минимуму глубины на отрезке; вариант RMQ определяет цену подготовки и запроса.',
      'AVL строже ограничивает разность высот и обычно даёт более низкое дерево поиска, но может делать больше балансирующих действий при обновлениях.',
      'Красно-чёрное дерево поддерживает более слабый цветовой инвариант; поиск, вставка и удаление остаются O(log n), что подходит для общего упорядоченного словаря.',
    ],
    complexity: [
      'LCA с binary lifting: подготовка O(n log n), запрос и подъём O(log n), память O(n log n).',
      'Euler tour занимает O(n); со sparse table подготовка RMQ O(n log n), запрос LCA O(1), память O(n log n).',
      'AVL: поиск, вставка и удаление O(log n), память O(n); высоты обновляются вдоль пути к корню.',
      'Красно-чёрное дерево: поиск, вставка и удаление O(log n), память O(n).',
    ],
    pitfalls: [
      'Таблица LCA неверна без согласованных глубин, корня и обработки разных компонент леса.',
      'После поворота AVL нужно обновлять высоты снизу вверх, включая обе изменившиеся вершины.',
      'Удаление в красно-чёрном дереве требует восстановить цветовые инварианты; одной перестановки указателей недостаточно.',
      'Политика равных ключей и компаратор должны задавать строгий порядок, иначе поиск и балансировка расходятся.',
    ],
    deepDives: [
      {
        id: 'balanced-search-trees',
        title: 'Сбалансированные деревья поиска: зачем нужны повороты',
        mentalModel: 'Обычный BST ускоряет операции только пока его высота мала. Балансирующее правило не меняет порядок ключей, а ограничивает высоту после вставок и удалений, поэтому путь поиска остаётся логарифмическим.',
        invariant: 'В AVL для каждой вершины разность высот левого и правого поддеревьев принадлежит {-1, 0, 1}. В красно-чёрном дереве корень и фиктивные листья чёрные, у красной вершины нет красного ребёнка, а все пути к листьям содержат одинаковое число чёрных вершин.',
        mechanics: [
          'Левый или правый поворот локально меняет связи трёх поддеревьев, сохраняет симметричный порядок BST и уменьшает перекос. AVL выбирает одинарный или двойной поворот по направлению тяжёлых рёбер.',
          'После вставки AVL обновляет высоты на пути к корню и чинит первый нарушенный баланс; удаление может потребовать восстановления выше по нескольким уровням.',
          'Красно-чёрное дерево допускает больший разброс высот, но восстанавливает цветовые правила перекрашиваниями и поворотами. Эти инварианты гарантируют высоту O(log n), не требуя идеальной симметрии.',
          'C++ std::set и std::map предоставляют упорядоченный обход и O(log n) для основных операций. Стандарт гарантирует контракт сложности, но не требует конкретно красно-чёрную реализацию. Python dict хранит порядок вставки, а не сортировку ключей; стандартного ordered set/map с логарифмическими обновлениями в Python нет.',
        ],
        chooseWhen: [
          'Нужен упорядоченный set/map, lower_bound, predecessor/successor или стабильная худшая граница O(log n) после обновлений — выбирайте сбалансированное дерево или библиотечный контейнер с таким контрактом.',
          'Если порядок не нужен, хеш-таблица обычно проще и даёт ожидаемое O(1). Сортированный Python list с bisect ускоряет поиск до O(log n), но вставка остаётся O(n) из-за сдвига.',
        ],
      },
      {
        id: 'binary-lifting',
        title: 'LCA через двоичные подъёмы',
        mentalModel: 'Для каждой вершины заранее хранятся прыжки к предкам на 1, 2, 4, 8 и далее рёбер. Любую высоту подъёма можно собрать из степеней двойки, как число из установленных битов.',
        invariant: 'up[j][v] — предок вершины v на расстоянии 2^j, а depth[v] — расстояние от выбранного корня. Для корня в таблице используется согласованный sentinel, обычно сам корень.',
        mechanics: [
          'DFS или BFS от корня задаёт depth и непосредственного родителя up[0][v]. Затем up[j][v] вычисляется как up[j - 1][up[j - 1][v]].',
          'Перед поиском LCA более глубокую вершину поднимают на разность глубин, проверяя биты этой разности.',
          'Если вершины не совпали, степени двойки перебирают от большой к малой и одновременно поднимают обе вершины там, где их 2^j-предки различаются. После цикла их непосредственный родитель и есть LCA.',
          'Подготовка занимает O(n log n) времени и памяти, один запрос — O(log n). Таблица относится к выбранному корню и статической структуре дерева; после изменения рёбер её нужно перестроить.',
        ],
        chooseWhen: [
          'Используйте binary lifting для большого числа запросов LCA или подъёма на k уровней в статическом дереве.',
          'Для одного или нескольких запросов простой подъём по родителям может быть достаточен; для динамического леса нужна другая структура и явно иной контракт.',
        ],
        codeExamples: [
          {
            language: 'cpp',
            label: 'C++17: подготовка и запросы LCA',
            code: String.raw`#include <iostream>
#include <queue>
#include <stdexcept>
#include <utility>
#include <vector>

class BinaryLifting {
public:
    BinaryLifting(const std::vector<std::vector<int>>& graph, int root)
        : size_(static_cast<int>(graph.size())) {
        if (size_ == 0 || root < 0 || root >= size_) {
            throw std::invalid_argument("tree and root must be valid");
        }
        long long degree_sum = 0;
        for (const auto& neighbors : graph) {
            degree_sum += static_cast<long long>(neighbors.size());
        }
        if (degree_sum != 2LL * (size_ - 1)) {
            throw std::invalid_argument("graph must contain n - 1 undirected edges");
        }

        levels_ = 1;
        while ((1LL << levels_) <= size_) {
            ++levels_;
        }
        depth_.assign(size_, -1);
        up_.assign(levels_, std::vector<int>(size_, root));

        std::queue<int> queue;
        queue.push(root);
        depth_[root] = 0;
        up_[0][root] = root;
        while (!queue.empty()) {
            const int vertex = queue.front();
            queue.pop();
            for (const int next : graph[vertex]) {
                check_vertex(next);
                if (next == up_[0][vertex]) {
                    continue;
                }
                if (depth_[next] != -1) {
                    throw std::invalid_argument("graph must be a tree");
                }
                depth_[next] = depth_[vertex] + 1;
                up_[0][next] = vertex;
                queue.push(next);
            }
        }
        for (const int depth : depth_) {
            if (depth == -1) {
                throw std::invalid_argument("tree must be connected");
            }
        }
        for (int level = 1; level < levels_; ++level) {
            for (int vertex = 0; vertex < size_; ++vertex) {
                up_[level][vertex] = up_[level - 1][up_[level - 1][vertex]];
            }
        }
    }

    int kth_ancestor(int vertex, int distance) const {
        check_vertex(vertex);
        if (distance < 0 || distance > depth_[vertex]) {
            throw std::out_of_range("ancestor is above the root");
        }
        for (int level = 0; distance > 0; ++level, distance >>= 1) {
            if (distance & 1) {
                vertex = up_[level][vertex];
            }
        }
        return vertex;
    }

    int lca(int first, int second) const {
        check_vertex(first);
        check_vertex(second);
        if (depth_[first] < depth_[second]) {
            std::swap(first, second);
        }
        first = kth_ancestor(first, depth_[first] - depth_[second]);
        if (first == second) {
            return first;
        }
        for (int level = levels_ - 1; level >= 0; --level) {
            if (up_[level][first] != up_[level][second]) {
                first = up_[level][first];
                second = up_[level][second];
            }
        }
        return up_[0][first];
    }

private:
    int size_ = 0;
    int levels_ = 0;
    std::vector<int> depth_;
    std::vector<std::vector<int>> up_;

    void check_vertex(int vertex) const {
        if (vertex < 0 || vertex >= size_) {
            throw std::out_of_range("vertex is outside the tree");
        }
    }
};

int main() {
    std::vector<std::vector<int>> tree(9);
    for (const auto [first, second] : std::vector<std::pair<int, int>>{
             {0, 1}, {0, 2}, {1, 3}, {1, 4}, {2, 5}, {2, 6}, {6, 7}, {7, 8}}) {
        tree[first].push_back(second);
        tree[second].push_back(first);
    }

    BinaryLifting lifting(tree, 0);
    std::cout << lifting.lca(3, 4) << '\n';
    std::cout << lifting.lca(3, 8) << '\n';
    std::cout << lifting.kth_ancestor(8, 4) << '\n';
    std::cout << lifting.lca(6, 8) << '\n';
}`,
          },
          {
            language: 'python',
            label: 'Python 3: тот же двоичный подъём',
            code: String.raw`from collections import deque


class BinaryLifting:
    def __init__(self, graph: list[list[int]], root: int) -> None:
        self._size = len(graph)
        if self._size == 0 or not 0 <= root < self._size:
            raise ValueError("tree and root must be valid")
        if sum(map(len, graph)) != 2 * (self._size - 1):
            raise ValueError("graph must contain n - 1 undirected edges")

        self._levels = max(1, self._size.bit_length())
        self._depth = [-1] * self._size
        self._up = [[root] * self._size for _ in range(self._levels)]
        self._depth[root] = 0
        self._up[0][root] = root

        queue = deque([root])
        while queue:
            vertex = queue.popleft()
            for neighbor in graph[vertex]:
                self._check_vertex(neighbor)
                if neighbor == self._up[0][vertex]:
                    continue
                if self._depth[neighbor] != -1:
                    raise ValueError("graph must be a tree")
                self._depth[neighbor] = self._depth[vertex] + 1
                self._up[0][neighbor] = vertex
                queue.append(neighbor)

        if any(depth == -1 for depth in self._depth):
            raise ValueError("tree must be connected")
        for level in range(1, self._levels):
            for vertex in range(self._size):
                middle = self._up[level - 1][vertex]
                self._up[level][vertex] = self._up[level - 1][middle]

    def kth_ancestor(self, vertex: int, distance: int) -> int:
        self._check_vertex(vertex)
        if not 0 <= distance <= self._depth[vertex]:
            raise IndexError("ancestor is above the root")
        level = 0
        while distance > 0:
            if distance & 1:
                vertex = self._up[level][vertex]
            distance >>= 1
            level += 1
        return vertex

    def lca(self, first: int, second: int) -> int:
        self._check_vertex(first)
        self._check_vertex(second)
        if self._depth[first] < self._depth[second]:
            first, second = second, first
        first = self.kth_ancestor(first, self._depth[first] - self._depth[second])
        if first == second:
            return first
        for level in range(self._levels - 1, -1, -1):
            if self._up[level][first] != self._up[level][second]:
                first = self._up[level][first]
                second = self._up[level][second]
        return self._up[0][first]

    def _check_vertex(self, vertex: int) -> None:
        if not 0 <= vertex < self._size:
            raise IndexError("vertex is outside the tree")


tree = [[] for _ in range(9)]
for first, second in [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5), (2, 6), (6, 7), (7, 8)]:
    tree[first].append(second)
    tree[second].append(first)

lifting = BinaryLifting(tree, 0)
print(lifting.lca(3, 4))
print(lifting.lca(3, 8))
print(lifting.kth_ancestor(8, 4))
print(lifting.lca(6, 8))`,
          },
        ],
      },
    ],
  },
  {
    id: 'ref-advanced-graphs',
    slug: 'advanced-graph-algorithms',
    title: 'Продвинутые алгоритмы на графах',
    aliases: ['advanced graph algorithms', 'mst', 'bellman ford', 'floyd warshall', 'scc', 'мосты'],
    group: 'graphs',
    prerequisites: ['s13-l02', 's13-l05', 's13-l06'],
    core: false,
    scope: 'MST, Bellman–Ford, Floyd–Warshall, SCC, мосты и точки сочленения.',
    useWhen: 'Когда базовых BFS, DFS и Dijkstra недостаточно: нужны остов, отрицательные веса, пути между всеми парами или структура связности графа.',
    decisionNotes: [
      'Для MST в неориентированном графе Kruskal удобен со списком рёбер и DSU, а Prim — со списками смежности и при постепенном росте одного дерева.',
      'Bellman–Ford решает задачу из одного источника при отрицательных рёбрах и обнаруживает достижимый отрицательный цикл; Floyd–Warshall нужен для всех пар на сравнительно небольшом графе.',
      'SCC разбивает ориентированный граф на компоненты взаимной достижимости; Kosaraju делает два обхода, Tarjan — один DFS со стеком.',
      'Мосты и точки сочленения ищут в неориентированном графе по времени входа и low-link; это другая задача, чем SCC.',
    ],
    complexity: [
      'Kruskal: O(m log m) времени и O(n) памяти помимо рёбер. Prim с двоичной кучей: O((n + m) log n) времени и O(n + m) памяти.',
      'Bellman–Ford: O(nm) времени и O(n) дополнительной памяти помимо списка рёбер; дополнительный проход выявляет достижимое улучшение из отрицательного цикла.',
      'Floyd–Warshall: O(n³) времени и O(n²) памяти.',
      'Kosaraju, Tarjan, поиск мостов и точек сочленения: O(n + m) времени и O(n + m) памяти с представлением списками смежности.',
    ],
    pitfalls: [
      'На несвязном графе алгоритм MST строит минимальный остовный лес, а не одно дерево.',
      'Нельзя складывать INF с весом без проверки: получится переполнение или ложное улучшение в Bellman–Ford и Floyd–Warshall.',
      'Отрицательная диагональ после Floyd–Warshall указывает на отрицательный цикл; обычные кратчайшие расстояния через него не определены снизу.',
      'В графе с кратными рёбрами DFS мостов должен пропускать родительское ребро по идентификатору, а не все рёбра в родительскую вершину.',
    ],
  },
  {
    id: 'ref-string-search',
    slug: 'advanced-string-search',
    title: 'Строковый поиск',
    aliases: ['string search', 'kmp', 'z function', 'rolling hash', 'aho corasick', 'поиск подстроки'],
    group: 'strings',
    prerequisites: ['s02-l01', 's17-l01'],
    core: false,
    scope: 'KMP, Z-функция, rolling hash и Aho–Corasick.',
    useWhen: 'Для поиска образцов и повторов в длинном тексте, сравнения множества подстрок или одновременного поиска словаря шаблонов.',
    decisionNotes: [
      'KMP хранит длину совпавшего префикса шаблона и подходит для точного поиска одного шаблона без возврата по тексту.',
      'Z-функция измеряет совпадение каждого суффикса с префиксом; через строку «шаблон + разделитель + текст» она находит все вхождения.',
      'Rolling hash быстро сравнивает подстроки после подготовки, но равенство хешей вероятностно и при строгой корректности требует проверки или нескольких независимых модулей.',
      'Aho–Corasick строит trie с суффиксными ссылками и обрабатывает много шаблонов за один проход по тексту.',
    ],
    complexity: [
      'KMP и Z-функция: O(n + m) времени для текста длины n и шаблона длины m, память O(m) у KMP и O(n + m) у конкатенационного Z-поиска.',
      'Rolling hash: O(n) подготовка и память, O(1) на хеш подстроки; двоичный поиск длины добавляет множитель O(log n).',
      'Aho–Corasick с полной таблицей переходов: O(S · A) на построение и память, O(n + z) на поиск; разреженное хранение уменьшает память, но цена перехода зависит от контейнера. Здесь S — сумма длин шаблонов, A — алфавит, z — число вхождений.',
    ],
    pitfalls: [
      'Разделитель для Z-поиска не должен встречаться ни в шаблоне, ни в тексте.',
      'После полного совпадения KMP нужно продолжить с префикс-функции, иначе потеряются перекрывающиеся вхождения.',
      'Один rolling hash допускает коллизии; переполнение и нормализация отрицательных остатков зависят от языка.',
      'В Aho–Corasick нужно учитывать выходы по цепочке суффиксных ссылок и заранее оценивать память таблицы переходов.',
    ],
  },
  {
    id: 'ref-advanced-dp',
    slug: 'advanced-dynamic-programming',
    title: 'Продвинутое DP',
    aliases: ['advanced dynamic programming', 'interval dp', 'bitmask dp', 'tree dp', 'дп по подмножествам'],
    group: 'dp',
    prerequisites: ['s16-l02', 's18-l02'],
    core: false,
    scope: 'Интервальное, битмасочное и древесное DP.',
    useWhen: 'Когда состояние естественно задаётся границами отрезка, подмножеством небольшого множества или ответом внутри поддерева.',
    decisionNotes: [
      'Интервальное DP подходит, если решение [l, r] строится из меньших вложенных интервалов или выбора последнего разбиения.',
      'Битмасочное DP применимо при небольшом числе объектов, когда маска полностью описывает уже выбранное подмножество; дополнительная координата хранит последний объект или ресурс.',
      'Древесное DP вычисляет состояние вершины после состояний детей; объединение детей должно явно описывать, что уже учтено.',
      'Оптимизация памяти допустима только после проверки зависимостей: перезапись слоя не должна уничтожать значения, нужные следующим переходам.',
    ],
    complexity: [
      'Типичное интервальное DP с перебором точки разбиения: O(n³) времени и O(n²) памяти; без перебора разбиения конкретная рекуррентность может дать O(n²).',
      'Битмасочное DP: обычно O(2ⁿ · n) или O(2ⁿ · n²) времени и O(2ⁿ) либо O(2ⁿ · n) памяти — в зависимости от наличия последней вершины в состоянии.',
      'Древесное DP: O(n) для константного состояния и перехода на ребро; с рюкзачным объединением состояний стоимость может вырасти до O(n²) или зависеть от лимита ресурса.',
    ],
    pitfalls: [
      'Неопределённый смысл состояния приводит к двойному учёту при разбиении интервала или слиянии поддеревьев.',
      'Неверный порядок длин интервалов или масок читает ещё не вычисленные состояния.',
      '2ⁿ ограничивает битмасочное DP и по времени, и по памяти; одна дополнительная размерность часто становится решающей.',
      'Рекурсивный обход глубокого дерева может переполнить стек; родитель должен быть исключён из списка детей.',
    ],
  },
  {
    id: 'ref-algorithmic-math',
    slug: 'algorithmic-mathematics',
    title: 'Алгоритмическая математика',
    aliases: ['algorithmic math', 'gcd', 'modular arithmetic', 'sieve', 'fast power', 'нод'],
    group: 'math',
    prerequisites: ['s18-l01'],
    core: false,
    scope: 'НОД, модульная арифметика, решето и быстрое возведение в степень.',
    useWhen: 'Когда задача использует делимость, большие степени, вычисления по модулю или много запросов о простых числах.',
    decisionNotes: [
      'Алгоритм Евклида даёт НОД; расширенный вариант дополнительно находит коэффициенты Безу и помогает решать линейные сравнения.',
      'Обратный элемент по модулю существует только при gcd(a, m) = 1; формула a^(m−2) применима для простого m и a, не делящегося на m.',
      'Решето Эратосфена выгодно для всех простых до общего предела; для одного большого числа лучше проверка делителей или подходящий тест простоты.',
      'Быстрое возведение в степень работает для любой ассоциативной операции с нейтральным элементом, включая умножение матриц.',
    ],
    complexity: [
      'Алгоритм Евклида: O(log min(|a|, |b|)) времени и O(1) памяти в итеративной форме.',
      'Быстрое возведение в степень: O(log e) операций для неотрицательной степени e, память O(1) в итеративной форме.',
      'Решето Эратосфена до N: O(N log log N) времени и O(N) памяти.',
      'Сложение и умножение по модулю считаются O(1) только для машинных чисел; для длинной арифметики стоимость зависит от числа разрядов.',
    ],
    pitfalls: [
      'Остаток отрицательного числа в C++ может быть отрицательным; перед сравнением результат нормализуют.',
      'Произведение может переполниться до взятия по модулю; нужен достаточно широкий тип или безопасное модульное умножение.',
      'Нельзя делить по модулю, не проверив существование обратного элемента.',
      'В решете 0 и 1 не простые, а проверка i · i должна учитывать переполнение типа.',
    ],
  },
  {
    id: 'ref-meet-in-middle',
    slug: 'meet-in-the-middle',
    title: 'Meet in the middle',
    aliases: ['meet in the middle', 'mitm', 'разделение перебора пополам'],
    group: 'techniques',
    prerequisites: ['s12-l01', 's08-l01'],
    core: false,
    scope: 'Разделение экспоненциального перебора на две половины с явной оценкой памяти.',
    useWhen: 'Когда полный перебор 2ⁿ уже невозможен, но n достаточно мало, чтобы перечислить примерно 2^(n/2) состояний каждой половины.',
    decisionNotes: [
      'Для проверки существования дополнения подойдут хеш-множество или сортировка одной половины с бинарным поиском.',
      'Для оптимизации суммы под ограничением удобно отсортировать списки и двигать два указателя либо делать upper_bound для каждого состояния.',
      'Состояние половины должно сохранять всю информацию, нужную при объединении: сумму, размер, маску или граничное условие.',
      'Если числовой предел суммы мал, псевдополиномиальное DP по сумме может быть дешевле, чем хранение 2^(n/2) состояний.',
    ],
    complexity: [
      'Генерация состояний двух половин: O(2^(n/2)) времени и памяти с точностью до постоянного множителя.',
      'Сортировка одной половины и бинарный поиск для каждого состояния: O(2^(n/2) · n) времени и O(2^(n/2)) памяти.',
      'После сортировки проход двумя указателями линеен по числу сгенерированных состояний, но сама сортировка остаётся O(2^(n/2) · n).',
    ],
    pitfalls: [
      'Даже 2^(n/2) может не поместиться в память; оценку нужно делать по размеру одного сохранённого состояния, а не только по их числу.',
      'Пустое подмножество относится к каждой половине и влияет на ответы для нулевой или достижимой одной половиной суммы.',
      'Удаление одинаковых сумм некорректно, если задача считает число способов или использует разные дополнительные атрибуты.',
      'Суммы подмножеств могут переполнить тип, даже если каждый отдельный элемент в него помещается.',
    ],
  },
];
