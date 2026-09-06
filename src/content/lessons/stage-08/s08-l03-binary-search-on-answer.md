---
{
  "id": "s08-l03",
  "slug": "binary-search-on-answer",
  "title": "Поиск по ответу и монотонный предикат",
  "stage": 8,
  "order": 3,
  "prerequisites": [
    "s08-l02",
    "s00-l03"
  ],
  "core": true,
  "patterns": [
    "binary-search"
  ],
  "summary": "Если допустимость ответа монотонна, можно искать минимальное допустимое значение, не строя сам ответ напрямую.",
  "outcomes": [
    "доказывать монотонность предиката",
    "выбирать корректные нижнюю и верхнюю границы ответа"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Поиск по ответу и монотонный предикат

Для грузов `[1,2,3,1,1]` и четырёх дней вместимость 2 недостаточна, а 3 уже позволяет разбиение `[1,2] | [3] | [1,1]`; первая допустимая вместимость равна 3.

<!-- algods:problem-shape -->
## Как найти минимальную допустимую вместимость?

Грузы идут по порядку; найти минимальную вместимость корабля, чтобы перевезти их не более чем за D дней.

<!-- algods:brute-force -->
## Проверка каждой возможной вместимости

Пробовать каждую вместимость от максимального груза до суммы и симулировать дни.

<!-- algods:bottleneck -->
## Почему диапазон ответов может быть огромным?

Диапазон числовых ответов может быть огромным, хотя проверка одной вместимости линейна.

<!-- algods:key-observation -->
## Допустимость меняется только один раз

Если вместимости C достаточно, любая большая вместимость тоже достаточна: предикат монотонен.

<!-- algods:invariant-state -->
## Какие ответы уже доказанно плохи и хороши?

Минимальная допустимая вместимость всегда остаётся в `[lo,hi]`; lo и hi сами являются границами числового ответа.

<!-- algods:algorithm -->
## Бинарный поиск с жадной проверкой canShip

Положить lo=max(weights), hi=sum(weights). Для mid посчитать требуемые дни жадной упаковкой по порядку. Если дней <=D, сохранить левую половину через hi=mid, иначе lo=mid+1.

<!-- algods:implementation -->
## Поиск вместимости на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
#include <cassert>
#include <limits>
#include <stdexcept>
#include <vector>
using namespace std;

bool canShip(const vector<int>& weights, int days, long long capacity) {
    if (days <= 0 || capacity < 0) throw invalid_argument("bad shipping limit");
    int usedDays = 1;
    long long load = 0;
    for (int weight : weights) {
        if (weight < 0) throw invalid_argument("negative weight");
        if (weight > capacity) return false;
        if (load > capacity - weight) {
            ++usedDays;
            load = 0;
        }
        load += weight;
    }
    return usedDays <= days;
}

long long minimumCapacity(const vector<int>& weights, int days) {
    if (weights.empty() || days <= 0) {
        throw invalid_argument("weights and days must be positive");
    }
    long long lo = 0;
    long long hi = 0;
    for (int weight : weights) {
        if (weight < 0) throw invalid_argument("negative weight");
        lo = max(lo, static_cast<long long>(weight));
        if (hi > numeric_limits<long long>::max() - weight) {
            throw overflow_error("total weight does not fit long long");
        }
        hi += weight;
    }
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canShip(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

int main() {
    assert(minimumCapacity({1, 2, 3, 1, 1}, 4) == 3);
    assert(minimumCapacity({5}, 1) == 5);
}
```

### Python 3

```python
def can_ship(weights: list[int], days: int, capacity: int) -> bool:
    if days <= 0 or capacity < 0:
        raise ValueError("bad shipping limit")
    used_days = 1
    load = 0
    for weight in weights:
        if weight < 0:
            raise ValueError("negative weight")
        if weight > capacity:
            return False
        if load > capacity - weight:
            used_days += 1
            load = 0
        load += weight
    return used_days <= days


def minimum_capacity(weights: list[int], days: int) -> int:
    if not weights or days <= 0:
        raise ValueError("weights and days must be positive")
    if any(weight < 0 for weight in weights):
        raise ValueError("negative weight")
    lo = max(weights)
    hi = sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_ship(weights, days, mid):
            hi = mid
        else:
            lo = mid + 1
    return lo


assert minimum_capacity([1, 2, 3, 1, 1], 4) == 3
assert minimum_capacity([5], 1) == 5
```

<!-- algods:complexity -->
## Логарифм диапазона умножается на линейную проверку

O(n + n log S) времени и O(1) дополнительной памяти, где `S = sum(weights) - max(weights) + 1` — число кандидатов в начальном диапазоне. C++ накапливает сумму с проверкой и отклоняет ввод, если она не помещается в `long long`; Python использует целые произвольной точности.

<!-- algods:edge-cases -->
## Пустой ввод, число дней и переполнение суммы

Один груз; D=1 даёт сумму; D>=n даёт максимум; нулевые веса допустимы, отрицательные — нет. Пустой список и `D <= 0` отклоняются.

<!-- algods:tests -->
## Тесты вокруг первой допустимой вместимости

`[1,2,3,1,1],4 -> 3`, D=1, D=n, один элемент, вместимость ровно на границе, пустой ввод и отрицательный вес.

<!-- algods:recognition -->
## Как узнать бинарный поиск по числовому ответу?

Ищется минимальное/максимальное число, есть быстрая проверка кандидата и её результат монотонен.

<!-- algods:when-not-to-use -->
## Когда проверка не монотонна?

Если увеличение кандидата может снова сделать допустимый ответ недопустимым, бинарный поиск по ответу некорректен.

<!-- algods:mini-check-1 -->
## Мини-проверка: нижняя граница вместимости

Вопрос: почему нижняя граница — max(weights)? Ответ: ни один груз нельзя делить, поэтому корабль обязан вместить самый тяжёлый.

<!-- algods:mini-check-2 -->
## Мини-проверка: почему проверка максимально загружает день?

Вопрос: почему проверка загружает день максимально? Ответ: при фиксированной вместимости раннее завершение дня не уменьшит число дней.

<!-- algods:guided-practice -->
## Проверьте вместимости 2 и 3 вручную

Для `[3,2,2,4,1,4]`, D=3 проверьте вместимости 6 и 5 вручную и определите направление поиска.

<!-- algods:independent-practice -->
## Найдите минимальный лимит без подсказки

### Задача 1

Найдите минимальную скорость обработки положительных работ, позволяющую завершить их не более чем за H целых часов.

<!-- algods:takeaway -->
## Сначала докажите монотонность, затем ищите границу

Сначала докажите монотонность проверки; только после этого двоичный поиск числового ответа становится корректным.
