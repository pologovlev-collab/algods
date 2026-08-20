---
{
  "id": "s10-l04",
  "slug": "bst-ordering-invariant",
  "title": "Инвариант бинарного дерева поиска",
  "stage": 10,
  "order": 4,
  "prerequisites": [
    "s10-l02",
    "s08-l01"
  ],
  "core": true,
  "patterns": [
    "tree",
    "binary-search"
  ],
  "summary": "BST ускоряет поиск только пока каждый узел разделяет ключи на строго определённые области.",
  "outcomes": [
    "использовать порядок BST для исключения поддерева",
    "называть политику дубликатов частью контракта структуры"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Инвариант бинарного дерева поиска

В BST `5(3,7)` поиск 6 сравнивается с 5 и идёт вправо, затем с 7 и идёт влево к `null`: двух сравнений достаточно, чтобы доказать отсутствие ключа.

<!-- algods:problem-shape -->
## Как искать ключ в бинарном дереве поиска?

Найти узел с target в бинарном дереве поиска.

<!-- algods:brute-force -->
## Обход всех узлов как в обычном дереве

Обойти DFS все узлы как в обычном бинарном дереве за O(n).

<!-- algods:bottleneck -->
## Почему полный DFS игнорирует порядок BST?

Полный обход игнорирует инвариант порядка.

<!-- algods:key-observation -->
## Сравнение с узлом исключает целое поддерево

Если target меньше ключа узла, в правом поддереве его быть не может; при большем симметрично исключается левое.

<!-- algods:invariant-state -->
## В какой области может оставаться target?

Если target существует, он находится в поддереве `current`; каждый шаг сохраняет это утверждение и удаляет невозможную половину.

<!-- algods:algorithm -->
## Спускаемся только в одну выбранную ветвь

Начать с корня. Пока current не null: при равенстве вернуть узел; при меньшем target перейти left, иначе right.

<!-- algods:implementation -->
## Поиск в BST на C++17 и Python 3

### C++17

```cpp
#include <cassert>
using namespace std;

struct Node {
    int value;
    Node* left;
    Node* right;
};

Node* search(Node* root, int target) {
    Node* current = root;
    while (current != nullptr) {
        if (current->value == target) return current;
        if (target < current->value) current = current->left;
        else current = current->right;
    }
    return nullptr;
}

int main() {
    Node left{3, nullptr, nullptr};
    Node right{7, nullptr, nullptr};
    Node root{5, &left, &right};
    assert(search(&root, 7) == &right);
    assert(search(&root, 6) == nullptr);
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


def search(root: Node | None, target: int) -> Node | None:
    current = root
    while current is not None:
        if current.value == target:
            return current
        if target < current.value:
            current = current.left
        else:
            current = current.right
    return None


root = Node(5, Node(3), Node(7))
assert search(root, 7) is root.right
assert search(root, 6) is None
```

<!-- algods:complexity -->
## Время определяется высотой, а не числом узлов напрямую

O(h) времени и O(1) памяти итеративно. В сбалансированном BST h=O(log n), в вырожденном h=O(n).

<!-- algods:edge-cases -->
## Пустое дерево, дубликаты и вырожденная форма

Пустое дерево; target в корне; отсутствующий ключ; вырожденное дерево; дубликаты требуют заранее выбранной политики.

<!-- algods:tests -->
## Тесты на найденный лист и отсутствующий ключ

null; поиск корня; поиск листа; отсутствующее значение между ключами; цепочка.

<!-- algods:recognition -->
## Как узнать, что дан именно BST?

Структура поддерживает глобальный порядок «все ключи слева меньше, справа больше» после каждой операции.

<!-- algods:when-not-to-use -->
## Почему правило не работает в произвольном бинарном дереве?

Произвольное бинарное дерево не является BST; нельзя выбирать ветвь только по сравнению значений.

<!-- algods:mini-check-1 -->
## Мини-проверка: всегда ли поиск логарифмический?

Вопрос: гарантирует ли форма дерева логарифмический поиск? Ответ: нет; без балансировки высота может стать n.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем политика дубликатов?

Вопрос: почему политика дубликатов важна? Ответ: она определяет, в какой ветви искать равный ключ и сохраняется ли инвариант.

<!-- algods:guided-practice -->
## Проследите поиск отсутствующего ключа 6

Постройте BST вставками `5,3,7,6,8` и проследите поиск 6 и отсутствующего 4.

<!-- algods:independent-practice -->
## Найдите диапазон ключей в BST самостоятельно

### Задача 1

Проверьте, является ли произвольное бинарное дерево строгим BST без дубликатов.

<!-- algods:takeaway -->
## Порядок BST позволяет исключать одну ветвь целиком

BST — это прежде всего инвариант порядка; скорость поиска определяется высотой, а не словом «бинарное».
