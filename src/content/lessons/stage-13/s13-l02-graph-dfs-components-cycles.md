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
    "помечать вершину до рекурсивных переходов",
    "обнаруживать цикл в простом неориентированном графе с учётом родителя"
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

### Почему посещённый сосед не всегда означает цикл

В неориентированном графе каждое ребро записано в обе стороны. Когда DFS приходит `parent → vertex`, список `vertex` снова содержит `parent`; это обратная запись того же ребра, а не цикл. Поэтому рекурсивный вызов передаёт родителя:

- непосещённого соседа продолжаем обходить;
- посещённого соседа, равного parent, пропускаем;
- другой посещённый сосед означает, что существует путь назад без родительского ребра, то есть цикл.

Для цепочки `0–1–2` вершина 1 видит посещённую 0, но пропускает её как родителя. В треугольнике `0–1–2–0` вершина 2 видит посещённую 0, которая не является её родителем, и цикл найден.

Этот критерий относится к **простому неориентированному графу** без параллельных рёбер. В ориентированном графе нужен другой инвариант: обычно три цвета, где ребро в серую вершину текущего стека означает цикл. Для мультиграфа родительское ребро различают по идентификатору, иначе второе параллельное ребро будет ошибочно пропущено.

<!-- algods:implementation -->
## Подсчёт компонент на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <stdexcept>
#include <vector>
using namespace std;

void validateGraph(const vector<vector<int>>& graph) {
    for (const auto& neighbors : graph) {
        for (int neighbor : neighbors) {
            if (neighbor < 0 || neighbor >= static_cast<int>(graph.size())) {
                throw out_of_range("neighbor");
            }
        }
    }
}

void visit(int vertex, const vector<vector<int>>& graph, vector<bool>& seen) {
    seen[vertex] = true;
    for (int neighbor : graph[vertex]) {
        if (!seen[neighbor]) visit(neighbor, graph, seen);
    }
}

int componentCount(const vector<vector<int>>& graph) {
    validateGraph(graph);
    vector<bool> seen(graph.size(), false);
    int components = 0;
    for (int vertex = 0; vertex < static_cast<int>(graph.size()); ++vertex) {
        if (seen[vertex]) continue;
        ++components;
        visit(vertex, graph, seen);
    }
    return components;
}

bool findUndirectedCycle(
    int vertex,
    int parent,
    const vector<vector<int>>& graph,
    vector<bool>& seen
) {
    seen[vertex] = true;
    for (int neighbor : graph[vertex]) {
        if (!seen[neighbor]) {
            if (findUndirectedCycle(neighbor, vertex, graph, seen)) return true;
        } else if (neighbor != parent) {
            return true;
        }
    }
    return false;
}

bool hasUndirectedCycle(const vector<vector<int>>& graph) {
    validateGraph(graph);
    vector<bool> seen(graph.size(), false);
    for (int vertex = 0; vertex < static_cast<int>(graph.size()); ++vertex) {
        if (!seen[vertex] && findUndirectedCycle(vertex, -1, graph, seen)) {
            return true;
        }
    }
    return false;
}

int main() {
    vector<vector<int>> graph{{1}, {0}, {3}, {2}};
    assert(componentCount(graph) == 2);
    assert(componentCount({}) == 0);
    assert(!hasUndirectedCycle({{1}, {0, 2}, {1}}));
    assert(hasUndirectedCycle({{1, 2}, {0, 2}, {0, 1}}));
    bool rejected = false;
    try {
        hasUndirectedCycle({{0}, {2}});
    } catch (const out_of_range&) {
        rejected = true;
    }
    assert(rejected);
}
```

### Python 3

```python
def validate_graph(graph: list[list[int]]) -> None:
    for neighbors in graph:
        for neighbor in neighbors:
            if not 0 <= neighbor < len(graph):
                raise IndexError("neighbor")


def component_count(graph: list[list[int]]) -> int:
    validate_graph(graph)
    seen = [False] * len(graph)

    def visit(vertex: int) -> None:
        seen[vertex] = True
        for neighbor in graph[vertex]:
            if not seen[neighbor]:
                visit(neighbor)

    components = 0
    for vertex in range(len(graph)):
        if seen[vertex]:
            continue
        components += 1
        visit(vertex)
    return components


def has_undirected_cycle(graph: list[list[int]]) -> bool:
    validate_graph(graph)
    seen = [False] * len(graph)

    def find_cycle(vertex: int, parent: int) -> bool:
        seen[vertex] = True
        for neighbor in graph[vertex]:
            if not seen[neighbor]:
                if find_cycle(neighbor, vertex):
                    return True
            elif neighbor != parent:
                return True
        return False

    for vertex in range(len(graph)):
        if not seen[vertex] and find_cycle(vertex, -1):
            return True
    return False


assert component_count([[1], [0], [3], [2]]) == 2
assert component_count([]) == 0
assert not has_undirected_cycle([[1], [0, 2], [1]])
assert has_undirected_cycle([[1, 2], [0, 2], [0, 1]])
try:
    has_undirected_cycle([[0], [2]])
    raise AssertionError("invalid neighbor was accepted")
except IndexError:
    pass
```

<!-- algods:complexity -->
## Каждая вершина и каждое ребро читаются один раз

Подсчёт компонент и проверка цикла работают за O(n+m) времени при списках смежности: каждая вершина помечается один раз, каждая запись ребра читается один раз. Память O(n) на `seen` и стек рекурсии; глубокая цепочка может потребовать явный stack, особенно в Python.

<!-- algods:edge-cases -->
## Пустой граф, изолированные вершины, self-loop и формат рёбер

Пустой граф; все вершины изолированы; одна компонента; self-loop сразу образует цикл; обычный цикл не должен вызвать бесконечную рекурсию. Каждый сосед обязан быть индексом `0..n-1`; обе реализации явно отклоняют нарушение. Проверка цикла предполагает симметричный список простого неориентированного графа.

<!-- algods:tests -->
## Тесты на одну, две и n компонент

n=0 -> 0; три изолированные -> 3; цепочка -> 1 и без цикла; две отдельные пары -> 2; треугольник содержит цикл; self-loop; цикл в компоненте, которая не содержит вершину 0; неверный сосед отклоняется.

<!-- algods:recognition -->
## Сигналы островов, областей и групп достижимости

Нужно найти острова, области, группы достижимости, проверить связность или понять, содержит ли неориентированная сеть замкнутый путь. Сначала уточните направленность и допускаются ли параллельные рёбра: от этого зависит инвариант цикла.

<!-- algods:when-not-to-use -->
## Почему простой DFS не находит сильные компоненты?

В ориентированном графе «компонента» может означать слабую или сильную связность; простой DFS даёт множество достижимых, не SCC. Родительский критерий цикла тоже нельзя переносить на ориентированный граф — там отслеживают вершины текущего пути.

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
## Состояние DFS отвечает и за охват, и за запрещённый возврат

Компоненты считаются числом стартов из ещё не охваченных вершин. Для цикла в простом неориентированном графе DFS дополнительно помнит родителя и отличает обратную запись того же ребра от пути к другой уже посещённой вершине.
