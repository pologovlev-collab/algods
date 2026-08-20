---
{
  "id": "s10-l01",
  "slug": "tree-model-and-traversals",
  "title": "Модель дерева и три порядка обхода",
  "stage": 10,
  "order": 1,
  "prerequisites": [
    "s01-l02",
    "s06-l02"
  ],
  "core": true,
  "patterns": [
    "tree"
  ],
  "summary": "Положение обработки корня относительно рекурсивных вызовов определяет preorder, inorder или postorder.",
  "outcomes": [
    "объяснять рекурсивную декомпозицию по поддеревьям",
    "выбирать порядок обхода по моменту обработки корня"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Модель дерева и три порядка обхода

Для дерева с корнем 1 и детьми 2 и 3 preorder записывает корень до рекурсии и получает `[1,2,3]`; inorder дал бы `[2,1,3]`, postorder — `[2,3,1]`.

<!-- algods:problem-shape -->
## Как порядок обработки корня меняет обход дерева?

Вернуть preorder бинарного дерева: корень, левое поддерево, правое поддерево.

<!-- algods:brute-force -->
## Какие узлы пришлось бы перечислять вручную?

Пытаться хранить все возможные пути от корня и затем восстанавливать порядок вершин.

<!-- algods:bottleneck -->
## Почему ручная логика не масштабируется с высотой?

Пути дублируют общие префиксы и не соответствуют простой структуре «корень + два поддерева».

<!-- algods:key-observation -->
## Поддерево имеет ту же форму задачи, что и дерево

Каждое непустое дерево однозначно состоит из корня и двух меньших деревьев, поэтому один и тот же код применим рекурсивно.

<!-- algods:invariant-state -->
## Что означает order после завершения вызова preorder?

Вызов `preorder(node)` добавляет ровно все вершины поддерева node в порядке root-left-right и не затрагивает другие поддеревья.

<!-- algods:algorithm -->
## Корень, левое и правое поддерево в нужном порядке

Для null вернуться. Иначе добавить значение узла, рекурсивно обойти left, затем right. Для inorder обработка корня стоит между вызовами, для postorder — после.

<!-- algods:implementation -->
## Preorder на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <vector>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
};

void preorder(Node* node, vector<int>& order) {
    if (node == nullptr) return;
    order.push_back(node->value);
    preorder(node->left, order);
    preorder(node->right, order);
}

int main() {
    Node left{2, nullptr, nullptr};
    Node right{3, nullptr, nullptr};
    Node root{1, &left, &right};
    vector<int> order;
    preorder(&root, order);
    assert((order == vector<int>{1, 2, 3}));
    order.clear();
    preorder(nullptr, order);
    assert(order.empty());
}
```

### Python 3

```python
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


def preorder(node: Node | None, order: list[int]) -> None:
    if node is None:
        return
    order.append(node.value)
    preorder(node.left, order)
    preorder(node.right, order)


order: list[int] = []
preorder(Node(1, Node(2), Node(3)), order)
assert order == [1, 2, 3]
order.clear()
preorder(None, order)
assert order == []
```

<!-- algods:complexity -->
## Каждый узел посещается один раз, стек зависит от высоты

O(n) времени, потому что каждый узел посещается один раз; O(h) стека вызовов, где h — высота, до O(n) у вырожденного дерева.

<!-- algods:edge-cases -->
## Пустое дерево, один ребёнок и глубокая цепочка

Пустое дерево; один узел; только левое или правое поддерево; вырожденная цепочка и риск глубокой рекурсии.

<!-- algods:tests -->
## Тесты, различающие preorder, inorder и postorder

Пустое -> `[]`; один узел; дерево `1(2,3)` -> `[1,2,3]`; несимметричное дерево.

<!-- algods:recognition -->
## Когда условие просит обойти каждое поддерево?

Задача просит посетить все узлы, а результат естественно складывается из результата левого и правого поддеревьев.

<!-- algods:when-not-to-use -->
## Когда рекурсию стоит заменить явным стеком?

Для очень глубокого дерева рекурсивный обход может переполнить стек; используйте явный stack.

<!-- algods:mini-check-1 -->
## Мини-проверка: где обрабатывается корень в inorder?

Вопрос: чем inorder отличается от preorder? Ответ: в inorder корень обрабатывается после левого поддерева, а не до него.

<!-- algods:mini-check-2 -->
## Мини-проверка: почему память бывает O(n)?

Вопрос: почему память не всегда O(log n)? Ответ: высота несбалансированного дерева может быть n.

<!-- algods:guided-practice -->
## Выпишите три порядка для одного дерева

Для дерева с корнем 4, левыми узлами 2/1/3 и правым 5 выпишите preorder, inorder и postorder.

<!-- algods:independent-practice -->
## Реализуйте postorder без готового шаблона

### Задача 1

Реализуйте итеративный inorder бинарного дерева с явным стеком и верните список значений.

<!-- algods:takeaway -->
## Место обработки корня определяет вид DFS

Один шаблон обхода становится тремя алгоритмами только из-за момента обработки корня.
