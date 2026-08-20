---
{
  "id": "s13-l02",
  "slug": "graph-dfs-components-cycles",
  "title": "DFS, компоненты и циклы",
  "stage": 13,
  "order": 2,
  "prerequisites": [
    "s13-l01",
    "s10-l02"
  ],
  "core": true,
  "patterns": [
    "graph"
  ],
  "summary": "Новый запуск DFS из непосещённой вершины открывает ровно одну новую компоненту связности.",
  "outcomes": [
    "отделять внешний цикл по компонентам от внутреннего DFS",
    "помечать вершину до рекурсивных переходов"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# DFS, компоненты и циклы

В графе с рёбрами `0–1` и `2–3` первый DFS помечает `{0,1}`, а внешний цикл запускает второй DFS из 2 и помечает `{2,3}`: компонент ровно две.

<!-- algods:problem-shape -->
## Как посчитать компоненты связности?

Посчитать компоненты связности неориентированного графа.

<!-- algods:brute-force -->
## Отдельный поиск пути для каждой пары вершин

Для каждой пары вершин отдельно запускать поиск пути и затем пытаться группировать ответы.

<!-- algods:bottleneck -->
## Почему повторные обходы исследуют одну область снова?

Одни и те же области графа обходятся много раз.

<!-- algods:key-observation -->
## Один DFS покрывает ровно компоненту старта

Один DFS посещает все и только вершины компоненты стартовой вершины.

<!-- algods:invariant-state -->
## Когда вершина считается назначенной компоненте?

visited содержит вершины уже полностью назначенных найденным компонентам; во время DFS текущая вершина помечается до обхода соседей.

<!-- algods:algorithm -->
## Внешний цикл запускает DFS только из unseen

Идти по всем вершинам. Если v не посещена, увеличить счётчик и запустить DFS(v), который отмечает v и рекурсивно идёт в непосещённых соседей.

<!-- algods:implementation -->
## Подсчёт компонент на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <stdexcept>
#include <vector>
using namespace std;

void visit(int vertex, const vector<vector<int>>& graph, vector<bool>& seen) {
    seen[vertex] = true;
    for (int neighbor : graph[vertex]) {
        if (neighbor < 0 || neighbor >= static_cast<int>(graph.size())) {
            throw out_of_range("neighbor");
        }
        if (!seen[neighbor]) visit(neighbor, graph, seen);
    }
}

int componentCount(const vector<vector<int>>& graph) {
    vector<bool> seen(graph.size(), false);
    int components = 0;
    for (int vertex = 0; vertex < static_cast<int>(graph.size()); ++vertex) {
        if (seen[vertex]) continue;
        ++components;
        visit(vertex, graph, seen);
    }
    return components;
}

int main() {
    vector<vector<int>> graph{{1}, {0}, {3}, {2}};
    assert(componentCount(graph) == 2);
    assert(componentCount({}) == 0);
}
```

### Python 3

```python
def component_count(graph: list[list[int]]) -> int:
    seen = [False] * len(graph)

    def visit(vertex: int) -> None:
        seen[vertex] = True
        for neighbor in graph[vertex]:
            if not 0 <= neighbor < len(graph):
                raise IndexError("neighbor")
            if not seen[neighbor]:
                visit(neighbor)

    components = 0
    for vertex in range(len(graph)):
        if seen[vertex]:
            continue
        components += 1
        visit(vertex)
    return components


assert component_count([[1], [0], [3], [2]]) == 2
assert component_count([]) == 0
```

<!-- algods:complexity -->
## Каждая вершина и каждое ребро читаются один раз

O(n+m) времени и O(n) памяти включая visited и стек рекурсии. Глубокий граф может потребовать явный stack.

<!-- algods:edge-cases -->
## Пустой граф, изолированные вершины и циклы

Пустой граф; все вершины изолированы; одна компонента; параллельные рёбра; цикл не должен вызвать бесконечную рекурсию. Каждый сосед обязан быть индексом `0..n-1`; обе реализации явно отклоняют нарушение.

<!-- algods:tests -->
## Тесты на одну, две и n компонент

n=0 -> 0; три изолированные -> 3; цепочка -> 1; две отдельные пары -> 2; треугольник; неверный сосед отклоняется.

<!-- algods:recognition -->
## Сигналы островов, областей и групп достижимости

Нужно найти острова, области, группы достижимости или проверить связность.

<!-- algods:when-not-to-use -->
## Почему простой DFS не находит сильные компоненты?

В ориентированном графе «компонента» может означать слабую или сильную связность; простой DFS даёт множество достижимых, не SCC.

<!-- algods:mini-check-1 -->
## Мини-проверка: когда ставить visited?

Вопрос: почему вершину помечают до рекурсивных вызовов? Ответ: сосед по циклу иначе успеет снова войти в неё.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем нужен внешний цикл?

Вопрос: зачем внешний цикл, если есть DFS? Ответ: один DFS не достигает вершин других компонент.

<!-- algods:guided-practice -->
## Проследите два запуска DFS

Для графа 0–1–2 и 3–4 покажите внешний цикл, два запуска DFS и состояние visited.

<!-- algods:independent-practice -->
## Посчитайте области в сетке без подсказки

### Задача 1

Посчитайте острова в прямоугольной сетке из 0/1 при связности только по четырём сторонам.

<!-- algods:takeaway -->
## Новый DFS из unseen открывает ровно одну компоненту

Компоненты считаются числом стартов обхода из ещё не охваченных вершин.
