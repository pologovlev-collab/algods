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
    "выводить O(N log k) через ограниченный размер heap"
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

int main() {
    assert((mergeSorted({{1, 4}, {2, 5}, {3}}) == vector<int>{1, 2, 3, 4, 5}));
    assert(mergeSorted({{}, {}}).empty());
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


assert merge_sorted([[1, 4], [2, 5], [3]]) == [1, 2, 3, 4, 5]
assert merge_sorted([[], []]) == []
```

<!-- algods:complexity -->
## O(N log k) при heap размера не больше k

Проверка упорядоченности занимает O(N), само слияние — O(N log k) для N элементов и не более k записей в heap. Дополнительная память O(k) без учёта возвращаемого массива O(N).

<!-- algods:edge-cases -->
## Пустые источники, дубликаты и нарушенный входной порядок

Нет источников; пустые источники; один источник; дубликаты; источники разной длины. Неотсортированный источник отклоняется до запуска heap.

<!-- algods:tests -->
## Тесты на разную длину потоков

`[] -> []`, `[[],[]] -> []`, `[[1,4],[2,5],[3]] -> [1,2,3,4,5]`, дубликаты и один длинный источник.

<!-- algods:recognition -->
## Когда данные приходят несколькими отсортированными сериями?

Есть несколько отсортированных потоков/списков, и после выбора головы нужно продвинуть только один источник.

<!-- algods:when-not-to-use -->
## Когда источники нельзя считать отсортированными?

Если источники не отсортированы, гарантия головы неверна; их сначала нужно упорядочить или выбрать другой подход.

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
## Достаточно сравнивать только доступные головы потоков

K-way merge использует готовый порядок источников и сравнивает только их текущие головы, уменьшая множитель до log k.
