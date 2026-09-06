---
{
  "id": "s09-l02",
  "slug": "linked-list-merge-cycle",
  "title": "Слияние, разворот и обнаружение цикла",
  "stage": 9,
  "order": 2,
  "prerequisites": [
    "s09-l01"
  ],
  "core": true,
  "patterns": [
    "linked-list",
    "two-pointers"
  ],
  "summary": "Разворот списка сохраняет следующий узел до смены стрелки, а алгоритм Флойда обнаруживает цикл по встрече указателей с разной скоростью.",
  "outcomes": [
    "разворачивать односвязный список на месте через prev, current и next",
    "доказывать алгоритм Флойда через относительную скорость и безопасно проверять fast"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Слияние, разворот и обнаружение цикла

Алгоритмы над списками не переставляют узлы в памяти — они меняют стрелки `next`. Поэтому `1→2→3→null` можно превратить в `3→2→1→null`, сохранив те же три узла. Но если структура входа неизвестна, сначала нужно понять, закончится ли обход на `null`: для списка `1→2→3→2…` это проверяет алгоритм Флойда.

<!-- algods:problem-shape -->
## Как развернуть цепочку и проверить, что её обход заканчивается?

Для ациклического односвязного списка вернуть новую голову после разворота всех стрелок на месте. Для списка с неизвестной структурой отдельно определить наличие цикла, используя O(1) дополнительной памяти. Разворот предполагает ациклический вход: иначе `current` никогда не достигнет `null`.

<!-- algods:brute-force -->
## Копирование значений и запоминание всех адресов

Для разворота можно скопировать значения в массив и построить новый список в обратном порядке. Для цикла можно хранить адрес каждого посещённого узла в hash set: повторный адрес означает цикл.

<!-- algods:bottleneck -->
## Почему вспомогательные коллекции здесь лишние?

Массив и hash set требуют O(n) дополнительной памяти. Новый список вдобавок теряет идентичность исходных узлов, хотя задача обычно требует лишь перенаправить существующие `next`.

<!-- algods:key-observation -->
## Сохраняем следующую стрелку, а цикл превращаем во встречу

При развороте единственная опасность — потерять ещё не обработанный суффикс после присваивания `current.next = prev`. Поэтому старый `current.next` нужно сначала сохранить. При поиске цикла, если цикла нет, `fast` достигнет `null`; если цикл есть, после входа обоих указателей в него `fast` сокращает расстояние до `slow` по модулю длины цикла.

<!-- algods:invariant-state -->
## Что означают prev, current и next на каждом шаге?

Перед каждой итерацией разворота `prev` — голова уже развёрнутого префикса, который заканчивается на `null`, а `current` — голова ещё не изменённого суффикса. Временный `next` сохраняет первый узел остатка до смены стрелки. Каждый исходный узел находится ровно в одной из двух частей, поэтому ни один узел не потерян.

Трассировка `1→2→3→null` показывает, как граница движется вправо:

| После итерации | `prev` | `current` | сохранённый `next` |
| --- | --- | --- | --- |
| 0 | `null` | `1→2→3` | — |
| 1 | `1→null` | `2→3` | `2` |
| 2 | `2→1→null` | `3` | `3` |
| 3 | `3→2→1→null` | `null` | `null` |

Для Флойда после k итераций `slow` прошёл k рёбер, а `fast` — 2k. Равенство ненулевых указателей означает, что они оказались в одном узле цикла.

<!-- algods:algorithm -->
## Разворачиваем три ссылки и отдельно запускаем Флойда

Для разворота начать с `prev = null` и `current = head`. Пока `current` существует: сохранить `next`, направить `current.next` на `prev`, затем сдвинуть `prev` и `current` вперёд. После цикла `prev` — новая голова.

Для обнаружения цикла инициализировать `slow` и `fast` головой. Пока `fast` и `fast.next` существуют, сдвигать `slow` на один узел, `fast` на два; при встрече вернуть `true`, а при достижении конца — `false`. Если контракт входа не гарантирует отсутствие цикла, эту проверку выполняют до разворота.

<!-- algods:implementation -->
## Разворот и проверка цикла на C++17 и Python 3

### C++17

```cpp
#include <cassert>
using namespace std;

struct Node {
    int value;
    Node* next;
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* current = head;
    while (current != nullptr) {
        Node* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

bool hasCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

int main() {
    Node third{3, nullptr};
    Node second{2, &third};
    Node first{1, &second};
    Node* reversed = reverseList(&first);
    assert(reversed == &third);
    assert(third.next == &second && second.next == &first);
    assert(first.next == nullptr);

    Node* restored = reverseList(reversed);
    assert(restored == &first);
    assert(first.next == &second && second.next == &third);
    assert(third.next == nullptr);
    assert(reverseList(nullptr) == nullptr);

    Node single{4, nullptr};
    assert(reverseList(&single) == &single);
    assert(single.next == nullptr);

    Node cycleThird{3, nullptr};
    Node cycleSecond{2, &cycleThird};
    Node cycleFirst{1, &cycleSecond};
    cycleThird.next = &cycleSecond;
    assert(hasCycle(&cycleFirst));
    assert(!hasCycle(restored));

    Node selfLoop{5, nullptr};
    selfLoop.next = &selfLoop;
    assert(hasCycle(&selfLoop));
}
```

### Python 3

```python
class Node:
    def __init__(self, value: int, next_node: "Node | None" = None) -> None:
        self.value = value
        self.next = next_node


def reverse_list(head: Node | None) -> Node | None:
    prev = None
    current = head
    while current is not None:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev


def has_cycle(head: Node | None) -> bool:
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


third = Node(3)
second = Node(2, third)
first = Node(1, second)
reversed_head = reverse_list(first)
assert reversed_head is third
assert third.next is second and second.next is first
assert first.next is None

restored = reverse_list(reversed_head)
assert restored is first
assert first.next is second and second.next is third
assert third.next is None
assert reverse_list(None) is None

single = Node(4)
assert reverse_list(single) is single
assert single.next is None

cycle_third = Node(3)
cycle_second = Node(2, cycle_third)
cycle_first = Node(1, cycle_second)
cycle_third.next = cycle_second
assert has_cycle(cycle_first)
assert not has_cycle(restored)

self_loop = Node(5)
self_loop.next = self_loop
assert has_cycle(self_loop)
```

<!-- algods:complexity -->
## Оба прохода линейны и используют O(1) памяти

Разворот работает за O(n): каждый узел посещается один раз. Флойд также работает за O(n) до конца или встречи. Оба алгоритма хранят только постоянное число указателей, поэтому требуют O(1) дополнительной памяти.

<!-- algods:edge-cases -->
## Пустой список, один узел и недопустимый для разворота цикл

Разворот пустого списка возвращает `null`; у одного узла голова не меняется; у двух узлов особенно легко забыть обнулить старую голову. Циклический список нельзя передавать в обычный `reverseList`: сначала проверьте контракт или вызовите `hasCycle`. Для Флойда важны пустой список, один узел без цикла, петля узла на себя и цикл из середины.

<!-- algods:tests -->
## Проверяем порядок, идентичность узлов и разные циклы

Для разворота: `null`; один узел; `1→2→3` превращается именно в те же узлы `3→2→1`, а старый head становится хвостом с `next = null`; повторный разворот восстанавливает цепочку. Для Флойда: `1→null`; `1→1`; `1→2→3→2`; длинный ациклический список.

<!-- algods:recognition -->
## Сигналы перенаправления стрелок и циклической структуры

Разворот нужен, когда требуется пройти список навстречу прежнему направлению: например, сравнить симметричные пары или развернуть участок. Флойд нужен, когда требуется обнаружить повтор состояния в детерминированной последовательности переходов без хранения всех состояний.

<!-- algods:when-not-to-use -->
## Когда изменение next нарушает контракт задачи?

Не разворачивайте исходный список, если его должны продолжить использовать неизменным или узлы разделяются несколькими структурами; тогда нужна копия либо последующее восстановление. Обычный разворот неприменим к циклу. Fast/slow не заменяет hash set, если нужно перечислить все повторения или структура имеет несколько исходящих переходов.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем сохранять current.next?

Вопрос: что произойдёт, если сначала выполнить `current.next = prev`, а потом попытаться перейти дальше? Ответ: ссылка на необработанный суффикс будет потеряна; поэтому старое `current.next` сохраняют в `next` до перенаправления.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем Флойду проверять fast.next?

Вопрос: зачем проверять и `fast`, и `fast.next`? Ответ: следующий шаг читает `fast.next.next`; без второй проверки будет разыменован `null` в списке нечётной длины.

<!-- algods:guided-practice -->
## Проследите границу разворота для трёх узлов

Для `4→7→9→null` после каждой итерации запишите цепочку от `prev`, цепочку от `current` и сохранённый `next`. Объясните через инвариант, почему все исходные узлы остаются достижимы.

<!-- algods:independent-practice -->
## Найдите максимальную сумму симметричной пары

### Задача 1

Для односвязного списка чётной длины найдите максимальную twin sum: сумма i-го узла от начала и i-го от конца. Найдите середину, разверните вторую половину, пройдите две половины одновременно и при необходимости восстановите список.

<!-- algods:takeaway -->
## Сохранённый next не теряет хвост, а разная скорость обнаруживает цикл

В развороте `prev` хранит готовую часть, `current` — оставшуюся, а сохранённый `next` не даёт потерять хвост. В алгоритме Флойда цикл обнаруживается благодаря конечности кольца и положительной относительной скорости указателей.
