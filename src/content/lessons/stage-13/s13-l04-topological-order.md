---
{
  "id": "s13-l04",
  "slug": "topological-order",
  "title": "Зависимости и топологический порядок",
  "stage": 13,
  "order": 4,
  "prerequisites": [
    "s13-l02",
    "s13-l03"
  ],
  "core": true,
  "patterns": [
    "topological-sort"
  ],
  "summary": "Алгоритм Кана удаляет только вершины без оставшихся prerequisites; неполный результат обнаруживает цикл.",
  "outcomes": [
    "строить входные степени",
    "отличать корректный топологический порядок от сортировки по номеру вершины"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Зависимости и топологический порядок

Для зависимостей `0→2, 1→2, 2→3` сначала готовы 0 и 1; только после обеих обработок indegree вершины 2 становится нулевой, затем освобождается 3.

<!-- algods:problem-shape -->
## Как выстроить задачи после всех prerequisites?

Упорядочить задачи ориентированного графа так, чтобы каждая prerequisite шла раньше зависимой задачи.

<!-- algods:brute-force -->
## Проверка всех n! перестановок

Перебирать все n! перестановок и проверять порядок каждого ребра.

<!-- algods:bottleneck -->
## Почему полный перебор слишком поздно замечает нарушение?

Большинство перестановок нарушает очевидные зависимости, но перебор узнаёт это слишком поздно.

<!-- algods:key-observation -->
## В DAG всегда можно выбрать вершину с indegree 0

В DAG всегда есть вершина с нулевой входной степенью; её безопасно поставить следующей и удалить исходящие рёбра.

<!-- algods:invariant-state -->
## Что считает indegree среди оставшихся задач?

Очередь содержит вершины без оставшихся входящих рёбер; `indegree[v]` считает зависимости v среди ещё не выданных вершин.

<!-- algods:algorithm -->
## Алгоритм Кана: выдаём готовые вершины

Посчитать indegree, добавить все нулевые вершины. Извлекать, добавлять в order, уменьшать indegree соседей и добавлять ставшие нулевыми. Если order короче n, есть цикл.

<!-- algods:implementation -->
## Топологическая сортировка на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <queue>
#include <stdexcept>
#include <vector>
using namespace std;

vector<int> topologicalOrder(const vector<vector<int>>& graph) {
    vector<int> indegree(graph.size(), 0);
    for (const auto& edges : graph) {
        for (int to : edges) {
            if (to < 0 || to >= static_cast<int>(graph.size())) {
                throw out_of_range("target");
            }
            ++indegree[to];
        }
    }
    queue<int> ready;
    for (int v = 0; v < static_cast<int>(graph.size()); ++v) {
        if (indegree[v] == 0) ready.push(v);
    }
    vector<int> order;
    while (!ready.empty()) {
        int vertex = ready.front();
        ready.pop();
        order.push_back(vertex);
        for (int to : graph[vertex]) {
            if (--indegree[to] == 0) ready.push(to);
        }
    }
    if (order.size() != graph.size()) return {};
    return order;
}

int main() {
    assert((topologicalOrder({{2}, {2}, {3}, {}}) == vector<int>{0, 1, 2, 3}));
    assert(topologicalOrder({{1}, {0}}).empty());
}
```

### Python 3

```python
from collections import deque


def topological_order(graph: list[list[int]]) -> list[int]:
    indegree = [0] * len(graph)
    for edges in graph:
        for target in edges:
            if not 0 <= target < len(graph):
                raise IndexError("target")
            indegree[target] += 1
    ready = deque(
        vertex for vertex, degree in enumerate(indegree) if degree == 0
    )
    order: list[int] = []
    while ready:
        vertex = ready.popleft()
        order.append(vertex)
        for target in graph[vertex]:
            indegree[target] -= 1
            if indegree[target] == 0:
                ready.append(target)
    return order if len(order) == len(graph) else []


assert topological_order([[2], [2], [3], []]) == [0, 1, 2, 3]
assert topological_order([[1], [0]]) == []
```

<!-- algods:complexity -->
## Каждая вершина и дуга обрабатываются один раз

O(n+m) времени и O(n) памяти помимо графа.

<!-- algods:edge-cases -->
## Пустой DAG, несколько порядков и self-loop

Пустой граф; несколько допустимых порядков; изолированные вершины; self-loop; цикл из нескольких вершин; неверный индекс назначения отклоняется.

<!-- algods:tests -->
## Тесты на цепочку, ромб и цикл

Цепочка; две независимые задачи; ромб зависимостей; цикл 0→1→0 возвращает отсутствие порядка; дуга за пределы графа отклоняется.

<!-- algods:recognition -->
## Сигналы расписания зависимостей

Нужно выполнить курсы, сборки или задачи после prerequisites; граф направленный.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему ответ может быть не единственным?

Вопрос: почему порядок может быть не единственным? Ответ: несколько нулевых вершин можно выбирать в разном порядке.

<!-- algods:mini-check-2 -->
## Мини-проверка: как обнаруживается цикл?

Вопрос: как цикл обнаруживается без отдельного DFS? Ответ: вершины цикла никогда не получают indegree 0, поэтому order короче n.

<!-- algods:guided-practice -->
## Проследите уменьшение indegree

Для рёбер `0→2,1→2,2→3` посчитайте indegree, каждое состояние очереди и два допустимых начала.

<!-- algods:independent-practice -->
## Составьте порядок курсов без подсказки

### Задача 1

Верните лексикографически минимальный топологический порядок или пустой результат при цикле.

<!-- algods:takeaway -->
## Нулевая входная степень означает готовность прямо сейчас

Топологическая сортировка последовательно выдаёт только те вершины, чьи зависимости уже сняты.
