---
{
  "id": "s07-l02",
  "slug": "merge-and-quicksort-reasoning",
  "title": "Слияние, разбиение и гарантии сортировок",
  "stage": 7,
  "order": 2,
  "prerequisites": [
    "s07-l01"
  ],
  "core": true,
  "patterns": [
    "sorting"
  ],
  "summary": "Merge sort получает гарантию O(n log n), потому что делит задачу по глубине и линейно сливает каждый уровень.",
  "outcomes": [
    "объяснять рекурсивный инвариант сортировки слиянием",
    "различать гарантии merge sort и средний случай quicksort"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Слияние, разбиение и гарантии сортировок

Трассировка `[3,1,2]`: половины `[3]` и `[1,2]` сортируются независимо, затем указатели выбирают 1, 2 и остаток 3 — получается `[1,2,3]`.

<!-- algods:problem-shape -->
## Как отсортировать массив с предсказуемым худшим временем?

Отсортировать массив сравнением с предсказуемым худшим временем.

<!-- algods:brute-force -->
## Повторный выбор минимального элемента

Многократно выбирать минимальный оставшийся элемент за O(n²).

<!-- algods:bottleneck -->
## Почему n линейных поисков дают O(n²)?

Линейный поиск минимума повторяется n раз.

<!-- algods:key-observation -->
## Две отсортированные половины сливаются линейно

Два уже отсортированных массива можно слить за линейное время двумя указателями.

<!-- algods:invariant-state -->
## Что уже гарантировано перед каждым шагом merge?

Перед merge обе половины отсортированы; во время merge результат содержит наименьшие уже выбранные элементы в правильном порядке.

<!-- algods:algorithm -->
## Делим диапазон, сортируем половины и сливаем

Рекурсивно разделить диапазон пополам до длины 0/1, отсортировать половины и слить их, выбирая меньшую голову.

<!-- algods:implementation -->
## Merge sort на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <vector>
using namespace std;

vector<int> mergeSort(const vector<int>& values) {
    if (values.size() <= 1) return values;
    int middle = static_cast<int>(values.size() / 2);
    vector<int> left(values.begin(), values.begin() + middle);
    vector<int> right(values.begin() + middle, values.end());
    left = mergeSort(left);
    right = mergeSort(right);

    vector<int> result;
    int i = 0;
    int j = 0;
    while (i < static_cast<int>(left.size()) && j < static_cast<int>(right.size())) {
        if (left[i] <= right[j]) result.push_back(left[i++]);
        else result.push_back(right[j++]);
    }
    result.insert(result.end(), left.begin() + i, left.end());
    result.insert(result.end(), right.begin() + j, right.end());
    return result;
}

int main() {
    assert((mergeSort({3, 1, 2}) == vector<int>{1, 2, 3}));
    assert(mergeSort({}).empty());
}
```

### Python 3

```python
def merge_sort(values: list[int]) -> list[int]:
    if len(values) <= 1:
        return values.copy()
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    result: list[int] = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]


assert merge_sort([3, 1, 2]) == [1, 2, 3]
assert merge_sort([]) == []
```

<!-- algods:complexity -->
## Логарифм уровней и линейная работа на уровне

O(n log n) времени во всех случаях и O(n) дополнительной памяти для показанной реализации. Quicksort обычно O(n log n), но без защиты имеет O(n²) худший случай.

<!-- algods:edge-cases -->
## Пустая половина, равные ключи и дополнительный буфер

Пустой массив; дубликаты; уже отсортированный; обратный порядок. `<=` при слиянии сохраняет стабильность.

<!-- algods:tests -->
## Тесты для разделения и стабильного слияния

`[]`, `[1]`, `[3,1,2] -> [1,2,3]`, `[2,1,2]` и отрицательные значения.

<!-- algods:recognition -->
## Когда нужна гарантия O(n log n)?

Нужна сортировка сравнением с гарантией худшего времени или стабильное слияние отсортированных источников.

<!-- algods:when-not-to-use -->
## Когда практичнее библиотечная сортировка?

Для маленькой фиксированной области ключей counting sort может быть быстрее; стандартную сортировку обычно не нужно переписывать на собеседовании.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему работа одного уровня равна O(n)?

Вопрос: почему работа одного уровня O(n)? Ответ: все слияния уровня вместе читают каждый элемент ровно один раз.

<!-- algods:mini-check-2 -->
## Мини-проверка: что делает merge стабильным?

Вопрос: что делает merge стабильным? Ответ: при равенстве брать элемент левой половины первым.

<!-- algods:guided-practice -->
## Слейте две половины по шагам

Вручную разложите `[4,1,3,2]` до единичных массивов и запишите каждое слияние снизу вверх.

<!-- algods:independent-practice -->
## Реализуйте сортировку разделением без подсказки

### Задача 1

Реализуйте стабильную сортировку слиянием пар `(ключ, исходная позиция)` и проверьте сохранение порядка равных ключей.

<!-- algods:takeaway -->
## Гарантию даёт баланс деления и линейное слияние

Гарантия merge sort складывается из log n уровней и O(n) суммарной работы на каждом уровне.
