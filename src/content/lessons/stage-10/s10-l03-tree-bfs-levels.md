---
{
  "id": "s10-l03",
  "slug": "tree-bfs-levels",
  "title": "BFS по уровням и выбор BFS/DFS",
  "stage": 10,
  "order": 3,
  "prerequisites": [
    "s10-l01",
    "s06-l02"
  ],
  "core": true,
  "patterns": [
    "tree",
    "queue"
  ],
  "summary": "Размер очереди в начале итерации фиксирует границу текущего уровня и не смешивает его с детьми.",
  "outcomes": [
    "реализовывать level-order с очередью",
    "обоснованно выбирать BFS для минимальной глубины"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# BFS по уровням и выбор BFS/DFS

Для дерева `1(2,3)` очередь начинается как `[1]`: снимаем ровно один узел и добавляем 2,3; следующий зафиксированный размер 2 даёт второй уровень `[2,3]`.

<!-- algods:problem-shape -->
## Как собрать значения дерева по уровням?

Вернуть значения бинарного дерева как список уровней.

<!-- algods:brute-force -->
## Определение глубины каждого узла отдельным проходом

Для каждой глубины заново обходить дерево и собирать узлы именно этой глубины.

<!-- algods:bottleneck -->
## Почему повторный поиск каждого уровня лишний?

Верхние узлы повторно посещаются для каждого уровня, что в цепочке даёт O(n²).

<!-- algods:key-observation -->
## Размер очереди фиксирует текущий слой

FIFO-очередь обрабатывает родителей раньше детей; количество элементов в начале уровня сообщает, сколько узлов относится к нему.

<!-- algods:invariant-state -->
## Что лежит в очереди перед началом уровня?

Перед внутренним циклом очередь содержит ровно все узлы текущего уровня слева направо.

<!-- algods:algorithm -->
## Снимаем levelSize узлов и добавляем их детей

Положить корень в queue. Пока queue не пуста, запомнить size, извлечь ровно size узлов в новый level и добавить их детей в конец.

<!-- algods:implementation -->
## Обход по уровням на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <queue>
#include <vector>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
};

vector<vector<int>> levelOrder(Node* root) {
    if (root == nullptr) return {};
    queue<Node*> pending;
    pending.push(root);
    vector<vector<int>> levels;
    while (!pending.empty()) {
        int levelSize = static_cast<int>(pending.size());
        vector<int> level;
        for (int i = 0; i < levelSize; ++i) {
            Node* node = pending.front();
            pending.pop();
            level.push_back(node->value);
            if (node->left) pending.push(node->left);
            if (node->right) pending.push(node->right);
        }
        levels.push_back(level);
    }
    return levels;
}

int main() {
    Node left{2, nullptr, nullptr};
    Node right{3, nullptr, nullptr};
    Node root{1, &left, &right};
    assert((levelOrder(&root) == vector<vector<int>>{{1}, {2, 3}}));
    assert(levelOrder(nullptr).empty());
}
```

### Python 3

```python
from collections import deque


class Node:
    def __init__(
        self,
        value: int,
        left: "Node | None" = None,
        right: "Node | None" = None,
    ) -> None:
        self.value = value
        self.left = left
        self.right = right


def level_order(root: Node | None) -> list[list[int]]:
    if root is None:
        return []
    pending = deque([root])
    levels: list[list[int]] = []
    while pending:
        level: list[int] = []
        for _ in range(len(pending)):
            node = pending.popleft()
            level.append(node.value)
            if node.left is not None:
                pending.append(node.left)
            if node.right is not None:
                pending.append(node.right)
        levels.append(level)
    return levels


assert level_order(Node(1, Node(2), Node(3))) == [[1], [2, 3]]
assert level_order(None) == []
```

<!-- algods:complexity -->
## O(w) для очереди и O(n) для возвращаемых уровней

O(n) времени. Вспомогательная очередь занимает O(w), где w — максимальная ширина дерева; возвращаемые уровни отдельно занимают O(n), потому что содержат каждое значение.

<!-- algods:edge-cases -->
## Пустое дерево, цепочка и широкий слой

Пустое дерево; один узел; цепочка; широкий последний уровень. Null-дети в очередь не добавляются.

<!-- algods:tests -->
## Тесты на границы между уровнями

null -> `[]`; `1` -> `[[1]]`; `1(2,3)` -> `[[1],[2,3]]`; несимметричное дерево.

<!-- algods:recognition -->
## Когда в условии важны расстояние или слой?

Нужны уровни, минимальное число рёбер в невзвешенной структуре или ближайший подходящий узел.

<!-- algods:when-not-to-use -->
## Когда DFS проще и экономнее по ширине?

Если нужно агрегировать поддерево снизу вверх, postorder DFS обычно естественнее и экономит очередь.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем сохранять размер очереди?

Вопрос: почему size читается до добавления детей? Ответ: иначе дети текущего уровня ошибочно попадут в тот же level.

<!-- algods:mini-check-2 -->
## Мини-проверка: всегда ли память BFS равна O(h)?

Вопрос: память BFS всегда O(h)? Ответ: нет, она зависит от ширины; у полного дерева последний уровень может содержать O(n) узлов.

<!-- algods:guided-practice -->
## Проведите очередь через дерево 1(2,3)

Проследите очередь для дерева `1(2(4,5),3)` и покажите её содержимое до каждого уровня.

<!-- algods:independent-practice -->
## Найдите среднее значение каждого уровня

### Задача 1

Верните значения уровней снизу вверх, не изменяя порядок узлов внутри каждого уровня.

<!-- algods:takeaway -->
## Размер очереди отделяет один слой от следующего

BFS отделяет уровни снимком размера очереди до того, как туда добавятся дети.
