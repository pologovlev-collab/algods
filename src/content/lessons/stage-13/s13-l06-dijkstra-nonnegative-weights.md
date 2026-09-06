---
{
  "id": "s13-l06",
  "slug": "dijkstra-nonnegative-weights",
  "title": "Дейкстра для неотрицательных весов",
  "stage": 13,
  "order": 6,
  "prerequisites": [
    "s13-l03",
    "s11-l01"
  ],
  "core": true,
  "patterns": [
    "shortest-path",
    "heap"
  ],
  "summary": "Дейкстра всегда продолжает с наименьшей известной метки и корректен только потому, что веса неотрицательны.",
  "outcomes": [
    "выполнять релаксацию ребра",
    "пропускать устаревшие записи priority queue"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Дейкстра для неотрицательных весов

Трассировка `0→1(5), 0→2(1), 2→1(2)`: метка 1 сначала равна 5, затем улучшается до 3; запись `(5,1)` остаётся в heap, но отбрасывается как устаревшая.

<!-- algods:problem-shape -->
## Как найти минимальные стоимости от одной вершины?

Найти минимальную стоимость пути от source до всех вершин графа с неотрицательными весами.

<!-- algods:brute-force -->
## Перебор всех простых путей

Перебирать все простые пути от source и выбирать минимальную стоимость для каждой вершины.

<!-- algods:bottleneck -->
## Почему число путей может быть экспоненциальным?

Число простых путей может быть экспоненциальным, а одинаковые префиксы путей пересчитываются.

<!-- algods:key-observation -->
## Актуальный минимум безопасно фиксируется при весах ≥ 0

Если извлечена актуальная минимальная метка d, путь через любую ещё не извлечённую вершину не может вернуться с меньшей стоимостью при неотрицательных рёбрах.

<!-- algods:invariant-state -->
## Что означают distance и записи в heap?

distance[v] — лучшая найденная стоимость; heap содержит кандидаты `(стоимость,вершина)`. Запись с d != distance[v] устарела и игнорируется.

<!-- algods:algorithm -->
## Извлечение минимума, проверка суммы и релаксация

Инициализировать INF, source=0. Извлекать минимум и пропускать устаревшее. Для каждого ребра сначала отклонить отрицательный вес и проверить `d <= LLONG_MAX-w`; только затем вычислить candidate, релаксировать и добавить новую запись.

<!-- algods:implementation -->
## Дейкстра на C++17 и Python 3

### C++17

```cpp
#include <functional>
#include <cassert>
#include <limits>
#include <queue>
#include <stdexcept>
#include <utility>
#include <vector>
using namespace std;

using Edge = pair<int, int>;

vector<long long> dijkstra(const vector<vector<Edge>>& graph, int source) {
    const long long infinity = numeric_limits<long long>::max();
    if (source < 0 || source >= static_cast<int>(graph.size())) {
        throw out_of_range("source");
    }
    for (const auto& edges : graph) {
        for (auto [to, weight] : edges) {
            if (to < 0 || to >= static_cast<int>(graph.size())) {
                throw out_of_range("target");
            }
            if (weight < 0) throw invalid_argument("negative weight");
        }
    }
    vector<long long> distance(graph.size(), infinity);
    priority_queue<
        pair<long long, int>,
        vector<pair<long long, int>>,
        greater<pair<long long, int>>
    > pending;
    distance[source] = 0;
    pending.push({0, source});

    while (!pending.empty()) {
        auto [currentDistance, vertex] = pending.top();
        pending.pop();
        if (currentDistance != distance[vertex]) continue;
        for (auto [to, weight] : graph[vertex]) {
            if (currentDistance > infinity - weight) continue;
            long long candidate = currentDistance + weight;
            if (candidate < distance[to]) {
                distance[to] = candidate;
                pending.push({candidate, to});
            }
        }
    }
    return distance;
}

int main() {
    vector<vector<Edge>> graph{{{1, 5}, {2, 1}}, {}, {{1, 2}}};
    assert((dijkstra(graph, 0) == vector<long long>{0, 3, 1}));
    vector<vector<Edge>> disconnected{{}, {}};
    auto result = dijkstra(disconnected, 0);
    assert(result[1] == numeric_limits<long long>::max());
}
```

### Python 3

```python
import heapq
from math import inf


def dijkstra(
    graph: list[list[tuple[int, int]]],
    source: int,
) -> list[float]:
    if not 0 <= source < len(graph):
        raise IndexError("source")
    for edges in graph:
        for target, weight in edges:
            if not 0 <= target < len(graph):
                raise IndexError("target")
            if weight < 0:
                raise ValueError("negative weight")
    distance = [inf] * len(graph)
    distance[source] = 0
    pending = [(0, source)]

    while pending:
        current_distance, vertex = heapq.heappop(pending)
        if current_distance != distance[vertex]:
            continue
        for target, weight in graph[vertex]:
            candidate = current_distance + weight
            if candidate < distance[target]:
                distance[target] = candidate
                heapq.heappush(pending, (candidate, target))
    return distance


graph = [[(1, 5), (2, 1)], [], [(1, 2)]]
assert dijkstra(graph, 0) == [0, 3, 1]
assert dijkstra([[], []], 0) == [0, inf]
```

<!-- algods:complexity -->
## Цена lazy-heap и условие оценки через log n

Предварительная проверка графа стоит O(n+m). Lazy-реализация без decrease-key делает до O(m) добавлений, поэтому общая граница — `O(n+m + m log(m+1))` времени и O(n+m) памяти; для простого графа `m <= n²`, и логарифм можно записать как O(log n). C++ использует `LLONG_MAX` как INF: конечная стоимость обязана быть строго меньше него; проверка запрещает переполняющее сложение, а сумма, равная sentinel, не релаксируется и остаётся INF. Python int не переполняется.

<!-- algods:edge-cases -->
## Отрицательные веса, недостижимость и переполнение long long

Недостижимые вершины остаются INF; нулевые веса допустимы; отрицательный вес, неверный source или target отклоняются до обхода; C++ проверяет переполнение до сложения.

<!-- algods:tests -->
## Тесты на улучшенную и устаревшую метку

Один узел; цепочка; более дешёвый обходной путь; недостижимая вершина; нулевое ребро.

<!-- algods:recognition -->
## Как узнать задачу на неотрицательные стоимости путей?

Нужен кратчайший путь, веса различаются и все неотрицательны.

<!-- algods:when-not-to-use -->
## Когда нужны Bellman–Ford или 0–1 BFS?

При отрицательных рёбрах нужен другой алгоритм; при единичных весах BFS проще и быстрее.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем пропускать устаревшую запись?

Вопрос: зачем в heap может быть несколько записей вершины? Ответ: стандартная очередь не делает decrease-key; новая лучшая метка добавляется отдельно.

<!-- algods:mini-check-2 -->
## Мини-проверка: почему отрицательное ребро ломает доказательство?

Вопрос: почему вершину с извлечённой минимальной меткой нельзя считать окончательной при отрицательном ребре? Ответ: путь через ещё не обработанную вершину может позже вернуться по отрицательному ребру и уменьшить уже извлечённую метку. Это прямо нарушает инвариант, на котором основан выбор Дейкстры.

<!-- algods:guided-practice -->
## Проследите улучшение расстояния 5 → 3

Для рёбер `0→1(5),0→2(1),2→1(2)` проследите heap, обновления distance и устаревшую запись `(5,1)`.

<!-- algods:independent-practice -->
## Найдите стоимости в взвешенном графе

### Задача 1

Верните не только расстояние, но и один кратчайший путь от source до target; недостижимая цель даёт пустой путь.

<!-- algods:takeaway -->
## Релаксация безопасна только после проверки контракта веса и суммы

Корректность Дейкстры опирается на неотрицательные веса и обработку только актуальной минимальной метки.
