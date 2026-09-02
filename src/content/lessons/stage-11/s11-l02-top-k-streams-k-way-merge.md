---
{
  "id": "s11-l02",
  "slug": "top-k-streams-k-way-merge",
  "title": "Top K, потоки и слияние источников",
  "stage": 11,
  "order": 2,
  "prerequisites": [
    "s11-l01",
    "s06-l02"
  ],
  "core": true,
  "patterns": [
    "heap"
  ],
  "summary": "При k-way merge куча хранит только текущую голову каждого источника, поэтому следующий глобальный минимум всегда находится на вершине.",
  "outcomes": [
    "сливать k отсортированных источников через кучу голов",
    "выводить O(N log k) через ограниченный размер heap",
    "поддерживать Top K элементов потока min-heap размера k"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Top K, потоки и слияние источников

Трассировка источников `[1,4]`, `[2,5]`, `[3]`: heap начинается с 1,2,3; после извлечения 1 в него входит 4, и глобальный порядок продолжается как 2,3,4,5.

<!-- algods:problem-shape -->
## Как слить k отсортированных источников?

Слить k уже отсортированных массивов в один отсортированный результат.

<!-- algods:brute-force -->
## Собрать все элементы и отсортировать заново

Скопировать все N элементов в один массив и заново отсортировать его.

<!-- algods:bottleneck -->
## Почему глобальная сортировка забывает готовый порядок?

Повторная сортировка игнорирует готовый порядок каждого источника и тратит O(N log N).

<!-- algods:key-observation -->
## Глобальный минимум находится среди k текущих голов

Следующий глобальный минимум обязан быть одной из текущих голов: любой другой элемент источника не меньше его головы.

<!-- algods:invariant-state -->
## Что именно хранится в heap голов?

Heap содержит по одной ещё не выданной голове каждого непустого источника; answer уже содержит наименьший глобальный префикс.

<!-- algods:algorithm -->
## Извлекаем голову и добавляем её преемника

Положить в min-heap тройки `(значение, источник, индекс)` для первых элементов. Извлечь минимум, добавить значение в answer и положить следующий элемент того же источника. Повторять до пустого heap.

### Один и тот же принцип ограничения heap решает Top K

Для k самых больших элементов не нужна куча всех N значений. Храните min-heap только из лучших k увиденных элементов. Его вершина — самый слабый из текущих победителей:

- пока элементов меньше k, добавляйте каждый;
- затем игнорируйте значение, если оно не больше вершины;
- иначе удалите вершину и добавьте новое значение.

После обработки `t` значений heap содержит `min(k,t)` наибольших элементов этого префикса с учётом повторов. Когда `t>=k`, новый элемент может изменить набор только вытеснив его минимум. Это даёт O(N log k) при `k>=2` вместо сортировки O(N log N) и позволяет обрабатывать поток без хранения всех элементов.

Не путайте направления: для Top K **наибольших** нужен min-heap размера k, чтобы быстро удалить наименьшего победителя. Для Top K наименьших симметрично нужен max-heap.

<!-- algods:implementation -->
## K-way merge на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
#include <cassert>
#include <functional>
#include <queue>
#include <stdexcept>
#include <tuple>
#include <vector>
using namespace std;

vector<int> mergeSorted(const vector<vector<int>>& sources) {
    for (const auto& values : sources) {
        if (!is_sorted(values.begin(), values.end())) {
            throw invalid_argument("source is not sorted");
        }
    }
    using Entry = tuple<int, int, int>;
    priority_queue<Entry, vector<Entry>, greater<Entry>> heads;
    for (int source = 0; source < static_cast<int>(sources.size()); ++source) {
        if (!sources[source].empty()) heads.push({sources[source][0], source, 0});
    }
    vector<int> answer;
    while (!heads.empty()) {
        auto [value, source, index] = heads.top();
        heads.pop();
        answer.push_back(value);
        int nextIndex = index + 1;
        if (nextIndex < static_cast<int>(sources[source].size())) {
            heads.push({sources[source][nextIndex], source, nextIndex});
        }
    }
    return answer;
}

vector<int> topKLargest(const vector<int>& values, int k) {
    if (k < 0 || k > static_cast<int>(values.size())) {
        throw invalid_argument("k is outside [0, size]");
    }
    priority_queue<int, vector<int>, greater<int>> selected;
    for (int value : values) {
        if (static_cast<int>(selected.size()) < k) {
            selected.push(value);
        } else if (k > 0 && value > selected.top()) {
            selected.pop();
            selected.push(value);
        }
    }
    vector<int> answer;
    while (!selected.empty()) {
        answer.push_back(selected.top());
        selected.pop();
    }
    reverse(answer.begin(), answer.end());
    return answer;
}

int main() {
    assert((mergeSorted({{1, 4}, {2, 5}, {3}}) == vector<int>{1, 2, 3, 4, 5}));
    assert(mergeSorted({{}, {}}).empty());
    assert((topKLargest({7, 1, 9, 3, 8, 2}, 3) == vector<int>{9, 8, 7}));
}
```

### Python 3

```python
import heapq


def merge_sorted(sources: list[list[int]]) -> list[int]:
    for values in sources:
        if any(values[index] > values[index + 1] for index in range(len(values) - 1)):
            raise ValueError("source is not sorted")
    heads: list[tuple[int, int, int]] = []
    for source, values in enumerate(sources):
        if values:
            heapq.heappush(heads, (values[0], source, 0))
    answer: list[int] = []
    while heads:
        value, source, index = heapq.heappop(heads)
        answer.append(value)
        next_index = index + 1
        if next_index < len(sources[source]):
            heapq.heappush(
                heads,
                (sources[source][next_index], source, next_index),
            )
    return answer


def top_k_largest(values: list[int], k: int) -> list[int]:
    if not 0 <= k <= len(values):
        raise ValueError("k is outside [0, size]")
    selected: list[int] = []
    for value in values:
        if len(selected) < k:
            heapq.heappush(selected, value)
        elif k > 0 and value > selected[0]:
            heapq.heapreplace(selected, value)
    return sorted(selected, reverse=True)


assert merge_sorted([[1, 4], [2, 5], [3]]) == [1, 2, 3, 4, 5]
assert merge_sorted([[], []]) == []
assert top_k_largest([7, 1, 9, 3, 8, 2], 3) == [9, 8, 7]
```

<!-- algods:complexity -->
## O(N log k) при heap размера не больше k

Пусть k — число источников, а h — наибольшее число одновременно активных непустых источников. Проверка упорядоченности занимает O(N), начальный просмотр источников — O(k). При `h>=2` само слияние занимает O(N log h), а при `h<=1` — O(N); вместе это O(k + N log h) для `h>=2` и O(k+N) иначе. Heap использует O(h) дополнительной памяти без учёта возвращаемого массива O(N).

При `k>=2` Top K обрабатывает N значений за O(N log k) и хранит O(k) элементов; при `k=0` или `k=1` показанная реализация делает O(N) работы. Затем функция сортирует только выбранные k значений за O(k log k), чтобы вернуть их по убыванию; если порядок ответа не важен, содержимое heap уже является нужным мультимножеством.

<!-- algods:edge-cases -->
## Пустые источники, дубликаты, k=0 и нарушенный порядок

Для merge: нет источников, пустые источники, один источник, дубликаты и разная длина; неотсортированный источник отклоняется до запуска heap. Для Top K: `k=0`, `k=N`, повторяющиеся значения и отрицательные числа; контракт отклоняет `k<0` и `k>N`.

<!-- algods:tests -->
## Тесты на разную длину потоков

`[] -> []`, `[[],[]] -> []`, `[[1,4],[2,5],[3]] -> [1,2,3,4,5]`, дубликаты и один длинный источник. Для Top K проверяйте `k=0`, `k=N`, вытеснение текущей вершины и сохранение повторяющихся победителей.

<!-- algods:recognition -->
## Когда данные приходят несколькими отсортированными сериями?

Есть несколько отсортированных потоков, и после выбора головы нужно продвинуть только один источник — это k-way merge. Нужно хранить лишь k лучших элементов большого потока — это bounded heap, где вершина является границей попадания в ответ.

<!-- algods:when-not-to-use -->
## Когда источники нельзя считать отсортированными?

Если источники не отсортированы, гарантия головы неверна. Если все данные уже помещаются в память и нужен полный порядок, обычная сортировка проще. Для небольшого фиксированного диапазона значений Top K иногда дешевле получить из частот, а для k близкого к N сортировка может быть практичнее.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему в heap нет всех N элементов?

Вопрос: почему в heap достаточно одной записи на источник? Ответ: остальные элементы источника не меньше его текущей головы.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем хранить source и index?

Вопрос: зачем хранить source и index вместе со значением? Ответ: после извлечения нужно узнать, какую следующую голову добавить.

<!-- algods:guided-practice -->
## Проследите смену голов трёх источников

Для `[1,7]`, `[2,3,9]`, `[4,5]` запишите heap до каждого извлечения и источник добавленной следующей головы.

<!-- algods:independent-practice -->
## Слейте журналы событий без общей сортировки

### Задача 1

Слейте k отсортированных потоков пар `(timestamp, sourceId)` с устойчивым разрешением равных timestamp по sourceId.

<!-- algods:takeaway -->
## Ограниченный heap хранит только кандидатов, которые ещё влияют на ответ

K-way merge сравнивает только текущие головы источников. Top K хранит только текущих победителей и использует вершину как порог вытеснения. В обоих случаях размер heap определяется k, а не общим числом элементов.
