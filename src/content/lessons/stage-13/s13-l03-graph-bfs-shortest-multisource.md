---
{
  "id": "s13-l03",
  "slug": "graph-bfs-shortest-multisource",
  "title": "BFS, кратчайший путь и несколько источников",
  "stage": 13,
  "order": 3,
  "prerequisites": [
    "s13-l01",
    "s10-l03"
  ],
  "core": true,
  "patterns": [
    "graph",
    "shortest-path"
  ],
  "summary": "Multi-source BFS кладёт все источники в нулевой слой до старта и одним обходом находит расстояние до ближайшего из них.",
  "outcomes": [
    "вычислять расстояния в невзвешенном графе",
    "инициализировать multi-source BFS несколькими вершинами расстояния 0"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# BFS, кратчайший путь и несколько источников

Трассировка цепочки `0–1–2–3–4` с источниками 0 и 4: нулевой слой `[0,4]`, затем `[1,3]`, затем `[2]`; расстояния равны `[0,1,2,1,0]`.

<!-- algods:problem-shape -->
## Как найти расстояние до ближайшего из многих источников?

Для каждой вершины найти минимальное число рёбер до ближайшей вершины из набора sources.

<!-- algods:brute-force -->
## Отдельный BFS из каждого источника

Запускать отдельный BFS из каждого источника, затем брать минимум k массивов расстояний.

<!-- algods:bottleneck -->
## Почему k обходов повторно читают один граф?

K обходов повторно читают те же вершины и рёбра, тратя O(k(n+m)).

<!-- algods:key-observation -->
## Все источники могут образовать общий нулевой слой

Все источники можно представить соседями виртуальной вершины: если положить их в queue одновременно с distance=0, фронты распространяются слоями и первый достигший фронт является ближайшим.

<!-- algods:invariant-state -->
## Почему первое расстояние до вершины уже минимально?

Все вершины в queue уже имеют минимальное расстояние до множества sources; неоткрытая вершина получает `distance[parent]+1` ровно при первом достижении любым фронтом.

<!-- algods:algorithm -->
## Сначала заполняем очередь источниками, затем расширяем фронты

Сначала проверить индексы соседей во всех списках смежности, даже в компонентах без источника. Затем заполнить dist=-1, каждому корректному уникальному source назначить 0 и добавить его в queue до цикла. После этого выполнить обычный BFS: первому непосещённому соседу назначить `dist[v]+1` и добавить его в конец.

<!-- algods:implementation -->
## Multi-source BFS на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <queue>
#include <stdexcept>
#include <vector>
using namespace std;

vector<int> nearestSourceDistances(
    const vector<vector<int>>& graph,
    const vector<int>& sources
) {
    const int vertexCount = static_cast<int>(graph.size());
    for (const vector<int>& neighbors : graph) {
        for (int neighbor : neighbors) {
            if (neighbor < 0 || neighbor >= vertexCount) {
                throw out_of_range("neighbor");
            }
        }
    }

    vector<int> distance(graph.size(), -1);
    queue<int> pending;
    for (int source : sources) {
        if (source < 0 || source >= vertexCount) {
            throw out_of_range("source");
        }
        if (distance[source] == 0) continue;
        distance[source] = 0;
        pending.push(source);
    }
    while (!pending.empty()) {
        int vertex = pending.front();
        pending.pop();
        for (int neighbor : graph[vertex]) {
            if (distance[neighbor] != -1) continue;
            distance[neighbor] = distance[vertex] + 1;
            pending.push(neighbor);
        }
    }
    return distance;
}

bool rejectsInvalidNeighbor(
    const vector<vector<int>>& graph,
    const vector<int>& sources
) {
    try {
        nearestSourceDistances(graph, sources);
    } catch (const out_of_range&) {
        return true;
    }
    return false;
}

int main() {
    vector<vector<int>> graph{{1}, {0, 2}, {1, 3}, {2, 4}, {3}};
    assert((nearestSourceDistances(graph, {0, 4}) == vector<int>{0, 1, 2, 1, 0}));
    assert((nearestSourceDistances(graph, {}) == vector<int>{-1, -1, -1, -1, -1}));
    assert(rejectsInvalidNeighbor({{}, {2}}, {0}));
    assert(rejectsInvalidNeighbor({{}, {2}}, {}));
}
```

### Python 3

```python
from collections import deque


def nearest_source_distances(
    graph: list[list[int]],
    sources: list[int],
) -> list[int]:
    for neighbors in graph:
        for neighbor in neighbors:
            if not 0 <= neighbor < len(graph):
                raise IndexError("neighbor")

    distance = [-1] * len(graph)
    pending: deque[int] = deque()
    for source in sources:
        if not 0 <= source < len(graph):
            raise IndexError("source")
        if distance[source] == 0:
            continue
        distance[source] = 0
        pending.append(source)
    while pending:
        vertex = pending.popleft()
        for neighbor in graph[vertex]:
            if distance[neighbor] != -1:
                continue
            distance[neighbor] = distance[vertex] + 1
            pending.append(neighbor)
    return distance


graph = [[1], [0, 2], [1, 3], [2, 4], [3]]
assert nearest_source_distances(graph, [0, 4]) == [0, 1, 2, 1, 0]
assert nearest_source_distances(graph, []) == [-1, -1, -1, -1, -1]

for invalid_sources in ([0], []):
    try:
        nearest_source_distances([[], [2]], invalid_sources)
    except IndexError:
        pass
    else:
        raise AssertionError("invalid neighbor must be rejected")
```

<!-- algods:complexity -->
## Полная проверка и один обход занимают O(n + m + k)

Проверка всех списков смежности и BFS вместе занимают O(n+m+k) времени для k исходных записей и O(n) вспомогательной памяти. Каждое ребро читается при проверке и не более одного раза при обходе, поэтому асимптотика не меняется. Гарантия кратчайшего расстояния относится к невзвешенным или равновесным рёбрам.

<!-- algods:edge-cases -->
## Пустой набор, дубли источников и неверные индексы

Пустой sources оставляет -1 только для корректного графа; повтор источника не ставится дважды; недостижимые вершины остаются -1. Неверный индекс источника отклоняется, а неверный индекс соседа отклоняется при полной предварительной проверке — даже если он лежит в недостижимой компоненте или список sources пуст.

<!-- algods:tests -->
## Тесты на встречу двух фронтов

Цепочка с источниками на концах; один источник; пустой sources; повтор источника; отдельная компонента; неверный сосед в недостижимой компоненте при одном и при нуле источников.

<!-- algods:recognition -->
## Когда нужно расстояние до ближайшего объекта?

Нужен минимум шагов/рёбер, распространение по слоям или расстояние до ближайшего из нескольких источников.

<!-- algods:when-not-to-use -->
## Когда веса рёбер требуют не BFS, а Дейкстру?

Для разных неотрицательных весов нужен Dijkstra; обычная очередь не учитывает стоимость ребра.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему все источники получают ноль?

Вопрос: почему все источники добавляются до первого pop? Ответ: только так они принадлежат одному нулевому слою и конкурируют на равных.

<!-- algods:mini-check-2 -->
## Мини-проверка: какой фронт побеждает при равенстве?

Вопрос: вершина одинаково близка к двум источникам. Какой источник «победит»? Ответ: тот, чей фронт раньше окажется в очереди; расстояние от этого не меняется. Если нужно ещё и имя ближайшего источника, правило порядка при равенстве должно быть частью контракта.

<!-- algods:guided-practice -->
## Разложите цепочку на слои от двух концов

Для цепочки 0–1–2–3–4–5 и sources `[1,5]` запишите начальную queue и все слои до заполнения distances.

<!-- algods:independent-practice -->
## Найдите ближайший выход для каждой клетки

### Задача 1

Для сетки с несколькими выходами найдите для каждой проходимой клетки расстояние до ближайшего выхода.

<!-- algods:takeaway -->
## Несколько источников — это один общий стартовый слой

Multi-source BFS объединяет несколько нулевых фронтов в один обход и фиксирует ближайший источник первым достижением.
