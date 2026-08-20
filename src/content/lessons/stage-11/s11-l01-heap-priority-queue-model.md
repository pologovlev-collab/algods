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
  }
}
---
# Куча и priority queue

Трассировка heapify для `[3,1,2]`: после линейного просеивания минимум 1 оказывается в корне; последовательные извлечения дают 1, 2, 3, хотя внутренний массив между извлечениями не отсортирован.

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
## Построение и извлечение из heap на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
#include <cassert>
#include <functional>
#include <vector>
using namespace std;

vector<int> sortedByHeapify(vector<int> values) {
    make_heap(values.begin(), values.end(), greater<int>{});
    vector<int> answer;
    while (!values.empty()) {
        pop_heap(values.begin(), values.end(), greater<int>{});
        answer.push_back(values.back());
        values.pop_back();
    }
    return answer;
}

int main() {
    assert((sortedByHeapify({3, 1, 2}) == vector<int>{1, 2, 3}));
    assert(sortedByHeapify({}).empty());
}
```

### Python 3

```python
import heapq


minimums = [3, 1, 2]
heapq.heapify(minimums)
ordered = [heapq.heappop(minimums) for _ in range(len(minimums))]
assert ordered == [1, 2, 3]

empty: list[int] = []
heapq.heapify(empty)
assert empty == []
```

<!-- algods:complexity -->
## Heapify O(n), а n последовательных push — O(n log n)

Последовательные n вызовов push стоят O(n log n). Heapify готового массива просеивает много узлов на малую глубину и строит кучу за O(n). После построения top — O(1), каждый pop — O(log n), память контейнера O(n).

<!-- algods:edge-cases -->
## Пустая куча, дубликаты и изменённый внутренний массив

Пустой поток; дубликаты; отрицательные; один элемент. `priority_queue` C++ по умолчанию max-heap, `heapq` Python — min-heap.

<!-- algods:tests -->
## Тесты на порядок последовательных извлечений

`[]`, `[3,1,2] -> 1,2,3`, `[2,2]`, отрицательные значения.

<!-- algods:recognition -->
## Сигналы динамического минимума или максимума

Нужно многократно получать текущий минимум/максимум, но полный порядок остальных элементов не нужен.

<!-- algods:when-not-to-use -->
## Когда достаточно один раз отсортировать массив?

Для одного глобального минимума достаточно линейного прохода; для поиска по произвольному ключу heap неудобна.

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
