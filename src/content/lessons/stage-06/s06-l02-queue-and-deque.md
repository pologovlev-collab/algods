---
{
  "id": "s06-l02",
  "slug": "queue-and-deque",
  "title": "Очередь и дек",
  "stage": 6,
  "order": 2,
  "prerequisites": [
    "s01-l01",
    "s04-l01"
  ],
  "core": true,
  "patterns": [
    "queue"
  ],
  "summary": "Дек хранит только ещё полезные элементы текущего окна и удаляет устаревшие индексы с противоположного конца.",
  "outcomes": [
    "различать FIFO-очередь и двусторонний дек",
    "поддерживать принадлежность индексов текущему окну"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Очередь и дек

Для массива `[1,-2,3,-4]` и окна длины 2 дек индексов отрицательных меняется так: `[] → [1] → [1] → [3]`; ответы трёх окон — `[-2,-2,-4]`.

<!-- algods:problem-shape -->
## Как найти первый отрицательный элемент каждого окна?

Для каждого окна длины k вернуть первый отрицательный элемент или 0, если отрицательных нет.

<!-- algods:brute-force -->
## Пересканирование каждого окна слева направо

Для каждого начала окна просматривать его k элементов слева направо до первого отрицательного.

<!-- algods:bottleneck -->
## Почему соседние окна повторяют одну работу?

Соседние окна почти совпадают, но перебор повторяет до k проверок; итог O(nk).

<!-- algods:key-observation -->
## Достаточно помнить индексы отрицательных чисел

Нужно помнить только индексы отрицательных чисел. Первый из них — ответ, а вышедшие за левую границу удаляются спереди.

<!-- algods:invariant-state -->
## Какие индексы обязаны оставаться в деке?

Дек содержит возрастающие индексы всех отрицательных элементов текущего окна; передний индекс — самый ранний.

<!-- algods:algorithm -->
## Как сдвигать окно и очищать оба конца?

При движении right добавить его индекс, если значение отрицательно. Когда сформировано окно, удалить спереди индексы меньше left, записать значение по front или 0.

<!-- algods:implementation -->
## Дек индексов на C++17 и Python 3

### C++17

```cpp
#include <deque>
#include <cassert>
#include <stdexcept>
#include <vector>
using namespace std;

vector<int> firstNegative(const vector<int>& values, int k) {
    if (k <= 0 || k > static_cast<int>(values.size())) {
        throw invalid_argument("bad window");
    }
    deque<int> negative;
    vector<int> answer;
    for (int right = 0; right < static_cast<int>(values.size()); ++right) {
        if (values[right] < 0) negative.push_back(right);
        int left = right - k + 1;
        if (left < 0) continue;
        while (!negative.empty() && negative.front() < left) {
            negative.pop_front();
        }
        answer.push_back(negative.empty() ? 0 : values[negative.front()]);
    }
    return answer;
}

int main() {
    assert((firstNegative({1, -2, 3, -4}, 2) == vector<int>{-2, -2, -4}));
    assert((firstNegative({1, 2}, 2) == vector<int>{0}));
}
```

### Python 3

```python
from collections import deque


def first_negative(values: list[int], k: int) -> list[int]:
    if k <= 0 or k > len(values):
        raise ValueError("bad window")
    negative: deque[int] = deque()
    answer: list[int] = []
    for right, value in enumerate(values):
        if value < 0:
            negative.append(right)
        left = right - k + 1
        if left < 0:
            continue
        while negative and negative[0] < left:
            negative.popleft()
        answer.append(0 if not negative else values[negative[0]])
    return answer


assert first_negative([1, -2, 3, -4], 2) == [-2, -2, -4]
assert first_negative([1, 2], 2) == [0]
```

<!-- algods:complexity -->
## Почему каждый индекс добавляется и удаляется один раз?

O(n) времени и O(k) памяти: каждый индекс добавляется и удаляется не более одного раза.

<!-- algods:edge-cases -->
## Некорректный размер окна и отсутствие кандидата

k=1; k=n; окно без отрицательных; все значения отрицательны; k вне диапазона считается ошибкой.

<!-- algods:tests -->
## Тесты на выпадение индекса из окна

`[1,-2,3,-4],2 -> [-2,-2,-4]`, `[1,2],2 -> [0]`, `[-1],1 -> [-1]`, недопустимый k.

<!-- algods:recognition -->
## Как узнать задачу на очередь актуальных кандидатов?

Нужно сохранять порядок поступления кандидатов и удалять устаревшие элементы с начала.

<!-- algods:when-not-to-use -->
## Когда нужно хранить всё окно, а не его первый элемент?

Если нужен только доступ к одному концу по LIFO, достаточно стека; если кандидаты имеют приоритет, нужна куча.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем хранить именно индексы?

Вопрос: зачем хранить индексы, а не значения? Ответ: индекс позволяет понять, вышел ли кандидат из окна.

<!-- algods:mini-check-2 -->
## Мини-проверка: когда удаляется front?

Вопрос: может ли один индекс удалиться дважды? Ответ: нет; после pop_front он навсегда покидает дек, поэтому суммарная работа линейна.

<!-- algods:guided-practice -->
## Проведите дек через три соседних окна

Для `[2,-1,-3,4,-2]`, k=3 выпишите дек индексов и ответ после каждого завершённого окна.

<!-- algods:independent-practice -->
## Найдите ответы для окон без подсказки

### Задача 1

Для каждого окна длины k верните индекс первого чётного элемента или `-1`; недопустимый k должен отклоняться.

<!-- algods:takeaway -->
## Дек избавляет соседние окна от повторного просмотра

Очередь сохраняет порядок прихода, а дек добавляет возможность удалять устаревших кандидатов с другого конца.
