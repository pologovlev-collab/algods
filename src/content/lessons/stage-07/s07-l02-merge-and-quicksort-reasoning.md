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
    "различать гарантии merge sort и средний случай quicksort",
    "поддерживать инвариант трёхчастного partition"
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

### Quicksort делит не по позиции, а по отношению к pivot

Quicksort выбирает опорное значение `pivot` и переставляет текущий диапазон так, чтобы получить три части: значения меньше pivot, равные pivot и больше pivot. В трёхчастном partition во время прохода поддерживается:

- `[lo, less)` уже меньше pivot;
- `[less, current)` уже равно pivot;
- `[current, greater)` ещё не разобрано;
- `[greater, hi)` уже больше pivot.

Элемент из неизвестной части либо переносится в левую часть, либо остаётся в расширившейся средней, либо меняется с элементом перед `greater`. После partition средняя часть уже стоит на окончательных позициях, поэтому рекурсия нужна только для левой и правой частей.

На `[3,1,2,2]` с pivot 2 разбиение даёт `[1] | [2,2] | [3]`. Это не означает, что каждое разбиение делит массив пополам: неудачные pivot могут оставлять часть размера `n-1`, откуда и берётся худший случай O(n²).

<!-- algods:implementation -->
## Merge sort на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
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

void quickSortRange(vector<int>& values, int lo, int hi) {
    if (hi - lo <= 1) return;
    int pivot = values[lo + (hi - lo) / 2];
    int less = lo;
    int current = lo;
    int greater = hi;
    while (current < greater) {
        if (values[current] < pivot) {
            swap(values[less++], values[current++]);
        } else if (values[current] > pivot) {
            swap(values[current], values[--greater]);
        } else {
            ++current;
        }
    }
    quickSortRange(values, lo, less);
    quickSortRange(values, greater, hi);
}

vector<int> quickSort(vector<int> values) {
    quickSortRange(values, 0, static_cast<int>(values.size()));
    return values;
}

int main() {
    assert((mergeSort({3, 1, 2}) == vector<int>{1, 2, 3}));
    assert(mergeSort({}).empty());
    assert((quickSort({3, 1, 2, 2, -1}) == vector<int>{-1, 1, 2, 2, 3}));
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


def quick_sort(values: list[int]) -> list[int]:
    ordered = values.copy()

    def sort_range(lo: int, hi: int) -> None:
        if hi - lo <= 1:
            return
        pivot = ordered[lo + (hi - lo) // 2]
        less = lo
        current = lo
        greater = hi
        while current < greater:
            if ordered[current] < pivot:
                ordered[less], ordered[current] = ordered[current], ordered[less]
                less += 1
                current += 1
            elif ordered[current] > pivot:
                greater -= 1
                ordered[current], ordered[greater] = ordered[greater], ordered[current]
            else:
                current += 1
        sort_range(lo, less)
        sort_range(greater, hi)

    sort_range(0, len(ordered))
    return ordered


assert merge_sort([3, 1, 2]) == [1, 2, 3]
assert merge_sort([]) == []
assert quick_sort([3, 1, 2, 2, -1]) == [-1, 1, 2, 2, 3]
```

<!-- algods:complexity -->
## Логарифм уровней и линейная работа на уровне

Merge sort выполняет O(n log n) работы во всех случаях и требует O(n) дополнительной памяти для показанной реализации; копирование срезов и результатов не меняет асимптотику. Для показанного детерминированного выбора средней позиции quicksort работает за O(n log n) в среднем при предположении о случайном порядке входа, а на специально подобранных крайне несбалансированных partition — за O(n²). При том же предположении рекурсивный стек занимает O(log n) в среднем и O(n) в худшем случае; для глубокой цепочки Python может раньше упереться в лимит рекурсии. Рандомизированный pivot переводит это утверждение в ожидаемую оценку относительно случайного выбора алгоритма, но не устраняет квадратичный худший случай.

<!-- algods:edge-cases -->
## Пустая половина, равные ключи, pivot и глубина стека

Пустой массив; дубликаты; уже отсортированный; обратный порядок. `<=` при слиянии сохраняет стабильность. Трёхчастный partition собирает равные pivot элементы в одну готовую область и не рекурсирует в неё, но сам quicksort не становится стабильным.

<!-- algods:tests -->
## Тесты для разделения и стабильного слияния

`[]`, `[1]`, `[3,1,2] -> [1,2,3]`, все равные, много дубликатов вокруг pivot, уже отсортированный, обратный порядок и отрицательные значения. Для стабильности merge проверяйте записи с одинаковым ключом и разными исходными позициями.

<!-- algods:recognition -->
## Когда нужна гарантия O(n log n)?

Нужна сортировка сравнением с гарантией худшего времени или стабильное слияние отсортированных источников — смотрите на merge. Нужна локальная перестановка без полного буфера и приемлем средний случай — идея partition объясняет quicksort и quickselect.

<!-- algods:when-not-to-use -->
## Когда практичнее библиотечная сортировка?

Для маленькой фиксированной области ключей counting sort может быть быстрее. В прикладной задаче стандартную сортировку обычно не нужно переписывать: библиотека лучше защищена от плохих входов, а Python-реализация учебного quicksort может переполнить стек на несбалансированных разбиениях.

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
## Merge гарантирует баланс, quicksort зависит от partition

Merge sort заранее делит диапазон пополам и потому гарантирует log n уровней с линейным слиянием. Quicksort сначала создаёт окончательную область pivot и выигрывает на удачных разбиениях, но его худшая глубина зависит от выбора pivot.
