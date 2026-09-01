---
{
  "id": "s13-l05",
  "slug": "dsu-connectivity",
  "title": "DSU и динамическая связность",
  "stage": 13,
  "order": 5,
  "prerequisites": [
    "s13-l01"
  ],
  "core": true,
  "patterns": [
    "disjoint-set"
  ],
  "summary": "DSU хранит каждую компоненту как дерево представителей и быстро поддерживает только объединения.",
  "outcomes": [
    "реализовывать find с сжатием пути",
    "объединять по размеру и понимать ограничение структуры"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# DSU и динамическая связность

После `union(0,1)` и `union(1,2)` запросы `find(0)`, `find(1)`, `find(2)` возвращают одного представителя, а `find(3)` — другого.

## Parent-массив кодирует лес представителей

Каждый элемент начинает отдельным деревом: `parent[v] = v`. Корень дерева ссылается на себя и служит **представителем** всего множества. Несколько деревьев образуют лес; два элемента принадлежат одной компоненте тогда и только тогда, когда `find` приводит их к одному корню.

Сам номер представителя не имеет предметного смысла и может измениться после объединения. DSU гарантирует разбиение на компоненты, а не выбор «самой маленькой вершины» корнем.

## Две оптимизации предотвращают длинные цепочки

Наивный `union` может последовательно подвесить `0 → 1 → 2 → …`, и `find` станет `O(n)`. **Union by size/rank** присоединяет корень меньшего дерева к большему, ограничивая рост высоты. **Сжатие пути** во время `find` перенаправляет все посещённые вершины ближе к найденному корню.

Оптимизации сохраняют один инвариант: родительская ссылка ведёт внутри той же компоненты, а корень ссылается на себя. Вместе они дают амортизированную `O(α(n))`, но отдельное состояние массива `parent` уже не похоже на историю добавленных рёбер.

## DSU отвечает о группах, но забывает геометрию графа

При добавлении неориентированного ребра `(u, v)` сравнение `find(u) == find(v)` обнаруживает цикл: если представители уже равны, новое ребро замыкает существующий путь. Алгоритм Краскала использует это правило, чтобы добавлять рёбра по весу без циклов.

DSU также подходит для онлайн-запросов связности и размеров компонент. Он не хранит конкретный путь, расстояние, порядок обхода или структуру остовного дерева — для этих ответов нужен сам граф и другой алгоритм.

<!-- algods:problem-shape -->
## Как отвечать на связность после добавления рёбер?

Последовательно добавлять неориентированные связи и отвечать, находятся ли две вершины в одной компоненте.

<!-- algods:brute-force -->
## Новый DFS для каждого запроса

Для каждого запроса связности запускать DFS/BFS по всем добавленным рёбрам.

<!-- algods:bottleneck -->
## Почему почти неизменный граф обходится снова?

Граф почти не меняется между запросами, но обход повторно исследует целые компоненты.

<!-- algods:key-observation -->
## Для связности достаточно представителя компоненты

При добавлении ребра достаточно слить представителей двух компонент; внутренние пути компоненты больше не важны.

<!-- algods:invariant-state -->
## Что гарантирует find для каждого элемента?

`find(v)` возвращает общий корень всех и только элементов компоненты v; parent-лес не содержит циклов.

<!-- algods:algorithm -->
## Сжатие путей и объединение меньшего дерева

Изначально parent[v]=v и size=1. Find идёт к корню и сжимает путь. Union находит корни, меньший подвешивает к большему и обновляет size.

<!-- algods:implementation -->
## DSU на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <numeric>
#include <stdexcept>
#include <utility>
#include <vector>
using namespace std;

class DisjointSet {
    vector<int> parent;
    vector<int> size;

    void validate(int value) const {
        if (value < 0 || value >= static_cast<int>(parent.size())) {
            throw out_of_range("element");
        }
    }

public:
    explicit DisjointSet(int n) {
        if (n < 0) throw invalid_argument("negative size");
        parent.resize(n);
        size.assign(n, 1);
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int value) {
        validate(value);
        if (parent[value] != value) parent[value] = find(parent[value]);
        return parent[value];
    }

    void unite(int first, int second) {
        int a = find(first);
        int b = find(second);
        if (a == b) return;
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a;
        size[a] += size[b];
    }
};

int main() {
    DisjointSet groups(4);
    groups.unite(0, 1);
    assert(groups.find(0) == groups.find(1));
    assert(groups.find(0) != groups.find(2));
}
```

### Python 3

```python
class DisjointSet:
    def __init__(self, size: int) -> None:
        if size < 0:
            raise ValueError("negative size")
        self.parent = list(range(size))
        self.component_size = [1] * size

    def find(self, value: int) -> int:
        if not 0 <= value < len(self.parent):
            raise IndexError("element")
        if self.parent[value] != value:
            self.parent[value] = self.find(self.parent[value])
        return self.parent[value]

    def unite(self, first: int, second: int) -> None:
        a = self.find(first)
        b = self.find(second)
        if a == b:
            return
        if self.component_size[a] < self.component_size[b]:
            a, b = b, a
        self.parent[b] = a
        self.component_size[a] += self.component_size[b]


groups = DisjointSet(4)
groups.unite(0, 1)
assert groups.find(0) == groups.find(1)
assert groups.find(0) != groups.find(2)
```

<!-- algods:complexity -->
## Амортизированная O(α(n)), а не буквальная O(1)

Последовательность операций имеет амортизированную O(α(n)) на операцию с union-by-size и path compression; практически близко к константе, но не буквальная O(1). Память O(n).

<!-- algods:edge-cases -->
## Повторный union, элемент с собой и неверный индекс

Union элемента с собой; повторное ребро; n=1; отрицательный размер и неверные индексы явно отклоняются классом. Это особенно важно в Python, где отрицательный индекс иначе обращается с конца списка.

<!-- algods:tests -->
## Тесты на слияние и независимые группы

Отдельные 0 и 1; union(0,1); повторный union; цепочка объединений; две независимые группы; неверный индекс отклоняется.

<!-- algods:recognition -->
## Сигналы добавочных связей и онлайн-запросов

Граф меняется только добавлением связей, а запросы спрашивают принадлежность компоненте.

<!-- algods:when-not-to-use -->
## Почему обычный DSU не умеет удалять рёбра?

Обычный DSU не поддерживает удаление рёбер: после сжатия пути он не знает, какие исходные связи обеспечивали компоненту. Он также не восстанавливает конкретный путь между вершинами. Для удалений нужны офлайн-приёмы, rollback-DSU или другая динамическая структура; это отдельные модели, а не дополнительный метод базового класса.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем сжимать путь?

Вопрос: зачем path compression? Ответ: после поиска он направляет вершины пути ближе к тому же корню и ускоряет будущие запросы.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем union by size?

Вопрос: зачем union-by-size? Ответ: меньший корень подвешивается к большему, поэтому деревья без необходимости не становятся высокими.

<!-- algods:guided-practice -->
## Проследите представителей после двух union

Для union(0,1), union(2,3), union(1,3) нарисуйте parent и size после каждой операции.

<!-- algods:independent-practice -->
## Поддерживайте размеры компонент в потоке запросов

### Задача 1

Обрабатывайте запросы union(a,b) и componentSize(a), возвращая текущий размер компоненты.

<!-- algods:takeaway -->
## DSU хранит компоненты, а не конкретные пути

DSU забывает форму графа и сохраняет ровно ту информацию, которая нужна для запросов связности.
