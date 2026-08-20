---
{
  "id": "s08-l02",
  "slug": "binary-search-boundaries",
  "title": "Первая и последняя подходящая позиция",
  "stage": 8,
  "order": 2,
  "prerequisites": [
    "s08-l01"
  ],
  "core": true,
  "patterns": [
    "binary-search"
  ],
  "summary": "Поиск границы рассматривает булеву последовательность false…false,true…true, а не обязательно точное значение.",
  "outcomes": [
    "находить первую истинную позицию в полуинтервале",
    "получать lower и upper boundary одним изменением предиката"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Первая и последняя подходящая позиция

Для `[1,2,2,4]` и порога 2 предикат `a[i] >= 2` даёт `false,true,true,true`; бинарный поиск должен вернуть границу перехода — индекс 1.

<!-- algods:problem-shape -->
## Как найти первую позицию со значением не меньше target?

Найти первый индекс, где значение отсортированного массива не меньше target; при отсутствии вернуть n.

<!-- algods:brute-force -->
## Сканирование до первого подходящего элемента

Сканировать слева до первого подходящего элемента за O(n).

<!-- algods:bottleneck -->
## Почему повторные запросы требуют использовать порядок?

При множестве запросов повторный линейный проход игнорирует монотонность условия.

<!-- algods:key-observation -->
## Ищем переход false → true, а не совпадение

Предикат `values[i] >= target` сначала ложен, а затем истинен; нужно найти место его единственного перехода.

<!-- algods:invariant-state -->
## Что доказано слева от lo и справа от hi?

Граница всегда находится в полуинтервале `[lo,hi)`; позиции строго левее lo доказанно ложны, позиции от hi доказанно истинны или hi=n.

<!-- algods:algorithm -->
## Сужаем полуинтервал [lo, hi)

Начать lo=0, hi=n. Пока lo<hi: если mid подходит, присвоить hi=mid, иначе lo=mid+1. Вернуть lo.

<!-- algods:implementation -->
## Нижняя граница на C++17 и Python 3

### C++17

```cpp
#include <cassert>
#include <vector>
using namespace std;

int lowerBoundary(const vector<int>& values, int target) {
    int lo = 0;
    int hi = static_cast<int>(values.size());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (values[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

int main() {
    assert(lowerBoundary({1, 2, 2, 4}, 2) == 1);
    assert(lowerBoundary({1, 2, 2, 4}, 5) == 4);
    assert(lowerBoundary({}, 5) == 0);
}
```

### Python 3

```python
def lower_boundary(values: list[int], target: int) -> int:
    lo = 0
    hi = len(values)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if values[mid] >= target:
            hi = mid
        else:
            lo = mid + 1
    return lo


assert lower_boundary([1, 2, 2, 4], 2) == 1
assert lower_boundary([1, 2, 2, 4], 5) == 4
assert lower_boundary([], 5) == 0
```

<!-- algods:complexity -->
## Логарифмический поиск позиции вставки

O(log n) времени и O(1) памяти. Для upper bound заменить условие на `values[mid] > target`.

<!-- algods:edge-cases -->
## Пустой массив, дубликаты и граница n

Пустой массив; все элементы меньше target — n; все не меньше — 0; дубликаты; target между значениями.

<!-- algods:tests -->
## Тесты на начало, середину и конец диапазона

`[],3 -> 0`, `[1,2,2,4],2 -> 1`, target 0 -> 0, target 5 -> 4, target 3 -> 3.

<!-- algods:recognition -->
## Сигналы «первый подходящий» и «последний неподходящий»

Нужна первая/последняя позиция, количество вхождений или граница монотонного свойства.

<!-- algods:when-not-to-use -->
## Когда предикат не образует единственного перехода?

Нельзя смешивать закрытый `[lo,hi]` и полуоткрытый `[lo,hi)` шаблоны без повторного доказательства.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему подходящий mid нельзя сразу вернуть?

Вопрос: почему подходящий mid не возвращается сразу? Ответ: слева может находиться более ранняя подходящая позиция.

<!-- algods:mini-check-2 -->
## Мини-проверка: что означает результат n?

Вопрос: что означает результат n? Ответ: подходящего элемента нет, но n является корректной позицией вставки.

<!-- algods:guided-practice -->
## Найдите границу в булевой последовательности

Для `[1,2,2,2,5]` найдите lower и upper boundary числа 2 и вычислите количество вхождений разностью.

<!-- algods:independent-practice -->
## Реализуйте верхнюю границу без подсказки

### Задача 1

Реализуйте upper boundary и с его помощью посчитайте число элементов, строго не превосходящих target.

<!-- algods:takeaway -->
## Граница — это поиск монотонного предиката

Граничный бинарный поиск сохраняет кандидата и продолжает искать более ранний переход предиката.
