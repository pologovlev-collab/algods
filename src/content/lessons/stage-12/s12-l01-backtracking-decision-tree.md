---
{
  "id": "s12-l01",
  "slug": "backtracking-decision-tree",
  "title": "Дерево решений: choose → recurse → undo",
  "stage": 12,
  "order": 1,
  "prerequisites": [
    "s01-l02"
  ],
  "core": true,
  "patterns": [
    "backtracking"
  ],
  "summary": "Перестановка выбирает следующий неиспользованный элемент; комбинация выбирает следующий индекс только справа, а подмножество допускает include/exclude.",
  "outcomes": [
    "различать деревья решений подмножеств, комбинаций и перестановок",
    "реализовывать choose-recurse-undo для перестановок"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Дерево решений: choose → recurse → undo

Трассировка `[1,2,3]`: путь `[1]` порождает `[1,2,3]` и `[1,3,2]`; после двух undo корень может начать независимую ветвь с 2.

<!-- algods:problem-shape -->
## Как перечислить все перестановки разных элементов?

Сгенерировать все перестановки массива разных элементов.

<!-- algods:brute-force -->
## Перебор всех последовательностей с последующей фильтрацией

Перебрать все последовательности длины n из n значений, а в конце отбрасывать те, где элемент повторился.

<!-- algods:bottleneck -->
## Почему поздняя проверка повторно строит неверные ветви?

На каждом уровне такой перебор снова выбирает уже использованные элементы и строит n^n кандидатов вместо n! допустимых листьев.

<!-- algods:key-observation -->
## Перестановка выбирает любой ещё не использованный индекс

Тип результата определяет ветвление: подмножество решает include/exclude, комбинация идёт только по индексам справа от start, перестановка выбирает любой ещё не использованный индекс.

<!-- algods:invariant-state -->
## Как path и used описывают текущую ветвь?

Перед вызовом `search()` path содержит уникальные выбранные элементы, а used точно отмечает их индексы; после возврата choose полностью отменён.

<!-- algods:algorithm -->
## Choose → recurse → undo для каждой позиции

Если path имеет длину n, скопировать его. Иначе перебрать все неиспользованные индексы: отметить used, добавить значение, вызвать search, затем удалить значение и снять used.

<!-- algods:implementation -->
## Перестановки на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <set>
#include <stdexcept>
#include <vector>
using namespace std;

void buildPermutations(
    const vector<int>& values,
    vector<bool>& used,
    vector<int>& path,
    vector<vector<int>>& answer
) {
    if (path.size() == values.size()) {
        answer.push_back(path);
        return;
    }
    for (int index = 0; index < static_cast<int>(values.size()); ++index) {
        if (used[index]) continue;
        used[index] = true;
        path.push_back(values[index]);
        buildPermutations(values, used, path, answer);
        path.pop_back();
        used[index] = false;
    }
}

vector<vector<int>> permutations(const vector<int>& values) {
    if (set<int>(values.begin(), values.end()).size() != values.size()) {
        throw invalid_argument("values must be distinct");
    }
    vector<bool> used(values.size(), false);
    vector<int> path;
    vector<vector<int>> answer;
    buildPermutations(values, used, path, answer);
    return answer;
}

int main() {
    auto answer = permutations({1, 2, 3});
    assert(answer.size() == 6);
    assert(set<vector<int>>(answer.begin(), answer.end()).size() == 6);
    assert(permutations({}).size() == 1);
}
```

### Python 3

```python
def permutations(values: list[int]) -> list[list[int]]:
    if len(set(values)) != len(values):
        raise ValueError("values must be distinct")
    used = [False] * len(values)
    path: list[int] = []
    answer: list[list[int]] = []

    def search() -> None:
        if len(path) == len(values):
            answer.append(path.copy())
            return
        for index, value in enumerate(values):
            if used[index]:
                continue
            used[index] = True
            path.append(value)
            search()
            path.pop()
            used[index] = False

    search()
    return answer


answer = permutations([1, 2, 3])
assert len(answer) == 6
assert len({tuple(item) for item in answer}) == 6
assert permutations([]) == [[]]
```

<!-- algods:complexity -->
## Почему число листьев равно n!?

O(n·n!) времени с учётом копирования n элементов в каждом из n! ответов; O(n) для path, used и стека без учёта результата.

<!-- algods:edge-cases -->
## Пустой набор, один элемент и повторяющиеся значения

Пустой массив имеет одну перестановку `[]`; один элемент; контракт этого примера требует разные значения и отклоняет дубликаты, которым нужно отдельное правило пропуска.

<!-- algods:tests -->
## Тесты на полноту и уникальность перестановок

`[] -> [[]]`, `[1] -> [[1]]`, `[1,2,3]` даёт 6 уникальных перестановок, каждая содержит все три значения; `[1,1]` отклоняется контрактом.

<!-- algods:recognition -->
## Как различать перестановки, сочетания и подмножества?

Нужно перечислить упорядоченные расстановки, неупорядоченные комбинации или подмножества через последовательность обратимых выборов.

<!-- algods:when-not-to-use -->
## Когда полный перебор n! заведомо слишком велик?

Если нужен только подсчёт или оптимум и подзадачи перекрываются, DP может избежать перечисления всех вариантов.

<!-- algods:mini-check-1 -->
## Мини-проверка: зачем массив used?

Вопрос: чем комбинация отличается от перестановки? Ответ: `[1,2]` и `[2,1]` — разные перестановки, но одна комбинация.

<!-- algods:mini-check-2 -->
## Мини-проверка: что обязан отменить undo?

Вопрос: что нужно отменить после рекурсии? Ответ: и последний элемент path, и соответствующую отметку used; иначе соседняя ветвь потеряет кандидата.

<!-- algods:guided-practice -->
## Разверните две ветви для [1,2,3]

Нарисуйте первые два уровня перестановок `[a,b,c]`; рядом покажите, как комбинации длины 2 используют start и не создают `[b,a]` после `[a,b]`.

<!-- algods:independent-practice -->
## Сгенерируйте сочетания размера k

### Задача 1

Сгенерируйте все перестановки `[1,2,3,4]` и проверьте программно, что их 24 и среди них нет повторов.

<!-- algods:takeaway -->
## Состояние пути должно полностью восстанавливаться после ветви

Бэктрекинг корректен, когда каждый выбор имеет симметричный откат и соседняя ветвь видит исходное состояние.
