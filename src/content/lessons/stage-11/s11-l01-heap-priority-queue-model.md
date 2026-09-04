---
{
  "id": "s11-l01",
  "slug": "heap-priority-queue-model",
  "title": "Куча и priority queue",
  "stage": 11,
  "order": 1,
  "prerequisites": [
    "s07-l01"
  ],
  "core": true,
  "patterns": [
    "heap"
  ],
  "summary": "Куча хранит частичный порядок: экстремум доступен сразу, но остальные элементы не обязаны быть полностью отсортированы.",
  "outcomes": [
    "различать heap и отсортированный массив",
    "учитывать противоположные значения API C++ и Python"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  },
  "learningBlocks": [
    {
      "id": "heap-tree-array",
      "type": "mental-model",
      "placement": "before-content",
      "title": "Один объект, два способа его увидеть",
      "body": "Форма полного дерева уже зашита в индексах массива, поэтому ссылки на детей и родителя вычисляются арифметически.",
      "items": [
        { "label": "array[i]", "detail": "Узел на позиции i в обходе дерева по уровням." },
        { "label": "2i + 1, 2i + 2", "detail": "Левый и правый ребёнок, если индекс существует." },
        { "label": "⌊(i − 1) / 2⌋", "detail": "Родитель любого узла, кроме корня." }
      ]
    }
  ]
}
---
# Куча и priority queue

Трассировка heapify для `[3,1,2]`: после линейного просеивания минимум 1 оказывается в корне; последовательные извлечения дают 1, 2, 3, хотя внутренний массив между извлечениями не отсортирован.

## Куча — полное бинарное дерево внутри массива

Полное бинарное дерево заполняет уровни сверху вниз, а последний уровень — слева направо. Поэтому ссылки на узлы не нужны: при нулевой индексации для позиции `i` вычисляются

- родитель: `(i - 1) / 2` с целочисленным делением, если `i > 0`;
- левый ребёнок: `2 * i + 1`;
- правый ребёнок: `2 * i + 2`.

Форма автоматически даёт высоту `O(log n)`. Это не BST: левый ребёнок не обязан быть меньше правого, а поиск произвольного ключа может потребовать просмотра всей кучи.

## Heap order связывает только родителя и детей

В min-heap значение родителя не больше значений детей; в max-heap — не меньше. По транзитивности корень становится глобальным минимумом или максимумом, хотя остальные элементы не отсортированы.

После добавления нового элемента в конец нарушиться может только путь к корню. **sift-up** меняет его с родителем, пока инвариант не восстановится. При извлечении корня последний элемент переносится наверх; **sift-down** меняет его с лучшим ребёнком и ремонтирует один путь вниз.

## Heapify начинает снизу, где работы почти нет

Листья уже являются корректными кучами из одного элемента. Поэтому heapify запускает sift-down от последнего внутреннего узла к корню. Узлов, способных пройти много уровней, мало, а большинство находится рядом с листьями. Сумма работ по высотам ограничена `O(n)`, поэтому построение не равно `n` независимым вставкам `O(n log n)`.

<!-- algods:problem-shape -->
## Как многократно извлекать текущий минимум?

Получать числа потока по возрастанию, многократно извлекая текущий минимум.

<!-- algods:brute-force -->
## Поиск минимального элемента перед каждым извлечением

После каждого добавления сортировать все накопленные элементы.

<!-- algods:bottleneck -->
## Почему повторный линейный минимум даёт O(n²)?

Полная сортировка поддерживает порядок между элементами, которые пока не нужны.

<!-- algods:key-observation -->
## Куче нужен порядок только между родителем и детьми

Для следующего извлечения важен только минимум; heap восстанавливает путь высоты log n вместо полного порядка.

<!-- algods:invariant-state -->
## Что гарантирует корень min-heap?

Вершина min-heap равна минимуму всех находящихся в нём элементов.

<!-- algods:algorithm -->
## Heapify сразу или последовательные push?

Если все n значений уже известны, выполнить heapify за O(n). Если они приходят потоком, добавлять push по O(log n). Затем читать вершину и делать pop по O(log n).

<!-- algods:implementation -->
## Учебная min-heap и библиотечные формы на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <functional>
#include <queue>
#include <stdexcept>
#include <utility>
#include <vector>
using namespace std;

class MinHeap {
    vector<int> data;

    void siftUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (data[parent] <= data[index]) break;
            swap(data[parent], data[index]);
            index = parent;
        }
    }

    void siftDown(int index) {
        while (true) {
            int best = index;
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            if (left < static_cast<int>(data.size()) && data[left] < data[best]) best = left;
            if (right < static_cast<int>(data.size()) && data[right] < data[best]) best = right;
            if (best == index) return;
            swap(data[index], data[best]);
            index = best;
        }
    }

public:
    explicit MinHeap(vector<int> values) : data(move(values)) {
        for (int index = static_cast<int>(data.size()) / 2 - 1; index >= 0; --index) {
            siftDown(index);
        }
    }

    void push(int value) {
        data.push_back(value);
        siftUp(static_cast<int>(data.size()) - 1);
    }

    int top() const {
        if (data.empty()) throw out_of_range("empty heap");
        return data.front();
    }

    int popMin() {
        int answer = top();
        data.front() = data.back();
        data.pop_back();
        if (!data.empty()) siftDown(0);
        return answer;
    }
};

int main() {
    MinHeap heap({3, 1, 2});
    assert(heap.popMin() == 1);
    heap.push(0);
    assert(heap.top() == 0);

    priority_queue<int> maximums;
    priority_queue<int, vector<int>, greater<int>> minimums;
    maximums.push(3);
    maximums.push(1);
    minimums.push(3);
    minimums.push(1);
    assert(maximums.top() == 3);
    assert(minimums.top() == 1);
}
```

### Python 3

```python
import heapq


class MinHeap:
    def __init__(self, values: list[int]) -> None:
        self.data = values.copy()
        for index in range(len(self.data) // 2 - 1, -1, -1):
            self._sift_down(index)

    def _sift_up(self, index: int) -> None:
        while index > 0:
            parent = (index - 1) // 2
            if self.data[parent] <= self.data[index]:
                return
            self.data[parent], self.data[index] = self.data[index], self.data[parent]
            index = parent

    def _sift_down(self, index: int) -> None:
        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            best = index
            if left < len(self.data) and self.data[left] < self.data[best]:
                best = left
            if right < len(self.data) and self.data[right] < self.data[best]:
                best = right
            if best == index:
                return
            self.data[index], self.data[best] = self.data[best], self.data[index]
            index = best

    def push(self, value: int) -> None:
        self.data.append(value)
        self._sift_up(len(self.data) - 1)

    def top(self) -> int:
        if not self.data:
            raise IndexError("empty heap")
        return self.data[0]

    def pop_min(self) -> int:
        answer = self.top()
        self.data[0] = self.data[-1]
        self.data.pop()
        if self.data:
            self._sift_down(0)
        return answer


heap = MinHeap([3, 1, 2])
assert heap.pop_min() == 1
heap.push(0)
assert heap.top() == 0

minimums = [3, 1]
heapq.heapify(minimums)
assert heapq.heappop(minimums) == 1
```

<!-- algods:complexity -->
## Heapify O(n), а n последовательных push — O(n log n)

Последовательные n вызовов push стоят O(n log n). Heapify готового массива просеивает много узлов на малую глубину и строит кучу за O(n). После построения top — O(1), push и pop — O(log n), память контейнера O(n). Внутренний массив занимает O(n), а учебная реализация выполняет sift-up/sift-down итеративно с O(1) дополнительной памятью.

<!-- algods:edge-cases -->
## Пустая куча, дубликаты и изменённый внутренний массив

Пустой поток; дубликаты; отрицательные; один элемент. Чтение или извлечение из пустой кучи требует явного контракта. `std::priority_queue` C++ по умолчанию max-heap; min-heap задают компаратором `greater`. Модуль Python `heapq` работает с обычным списком как с min-heap и не предоставляет отдельный класс-контейнер.

<!-- algods:tests -->
## Тесты на порядок последовательных извлечений

`[]`, `[3,1,2] -> 1,2,3`, `[2,2]`, отрицательные значения.

<!-- algods:recognition -->
## Сигналы динамического минимума или максимума

Нужно многократно получать текущий минимум/максимум, но полный порядок остальных элементов не нужен.

<!-- algods:when-not-to-use -->
## Когда достаточно один раз отсортировать массив?

Для одного глобального минимума достаточно линейного прохода; если нужны все элементы один раз по порядку, обычная сортировка часто проще. Для поиска произвольного ключа, проверки принадлежности или диапазонного обхода heap неудобна. Куча особенно полезна для top-k, потокового экстремума и k-way merge, где набор меняется между извлечениями.

<!-- algods:mini-check-1 -->
## Мини-проверка: обязана ли куча быть отсортирована?

Вопрос: является ли внутренний массив heap отсортированным? Ответ: нет; гарантируется только отношение родителя и детей.

<!-- algods:mini-check-2 -->
## Мини-проверка: как получить min-heap в C++ и Python?

Вопрос: как получить min-heap в C++? Ответ: указать `greater<int>`; Python `heapq` уже минимальная куча.

<!-- algods:guided-practice -->
## Проследите просеивание массива [3,1,2]

Сначала вставьте 4,1,3,2 последовательными push и запишите вершины. Затем выполните heapify того же массива снизу вверх и сравните число просеиваний.

<!-- algods:independent-practice -->
## Постройте max-heap без подсказки

### Задача 1

Получая команды add(x) и extractMax, реализуйте обработчик max-heap и явно определите поведение extractMax для пустой структуры.

<!-- algods:takeaway -->
## Куча упорядочивает доступ к экстремуму, не весь массив

Heap платит log n за обновление именно той части порядка, которая нужна для быстрого экстремума.
