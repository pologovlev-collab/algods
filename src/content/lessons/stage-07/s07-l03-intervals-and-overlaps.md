---
{
  "id": "s07-l03",
  "slug": "intervals-and-overlaps",
  "title": "Интервалы, пересечения и объединение",
  "stage": 7,
  "order": 3,
  "prerequisites": [
    "s07-l01",
    "s03-l01"
  ],
  "core": true,
  "patterns": [
    "intervals",
    "sorting"
  ],
  "summary": "После сортировки по началу достаточно сравнивать новый интервал с последним уже объединённым.",
  "outcomes": [
    "формулировать условие пересечения интервалов",
    "объединять интервалы одним проходом после сортировки"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Интервалы, пересечения и объединение

После сортировки `[1,3],[2,6],[8,10]` второй интервал пересекает хвост ответа и расширяет его до `[1,6]`; `[8,10]` начинается позже 6 и создаёт новый блок.

<!-- algods:problem-shape -->
## Как объединить пересекающиеся интервалы?

Объединить все пересекающиеся закрытые интервалы `[start,end]`.

<!-- algods:brute-force -->
## Поиск и слияние произвольной пары

Пока возможно, искать любую пересекающуюся пару, объединять её и начинать поиск заново.

<!-- algods:bottleneck -->
## Почему повторный поиск пересечений запутывает решение?

После каждого объединения пары пересматриваются, что может привести к O(n²) и сложной логике.

<!-- algods:key-observation -->
## Сортировка по start оставляет один активный хвост

После сортировки по start следующий интервал либо пересекается с последним объединённым, либо начинает новую отдельную группу.

<!-- algods:invariant-state -->
## Что гарантирует массив merged после каждого интервала?

`merged` содержит точное объединение обработанного префикса, интервалы в нём отсортированы и не пересекаются.

<!-- algods:algorithm -->
## Расширяем последний блок или начинаем новый

Отсортировать интервалы. Первый добавить в ответ. Для каждого следующего: если `start <= merged.back.end`, расширить end максимумом; иначе добавить новый.

<!-- algods:implementation -->
## Слияние интервалов на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
#include <cassert>
#include <stdexcept>
#include <vector>
using namespace std;

struct Interval {
    int start;
    int end;
};

vector<Interval> mergeIntervals(vector<Interval> intervals) {
    if (intervals.empty()) return {};
    for (const Interval& interval : intervals) {
        if (interval.start > interval.end) {
            throw invalid_argument("start exceeds end");
        }
    }
    sort(intervals.begin(), intervals.end(), [](Interval a, Interval b) {
        return a.start < b.start || (a.start == b.start && a.end < b.end);
    });
    vector<Interval> merged{intervals[0]};
    for (int i = 1; i < static_cast<int>(intervals.size()); ++i) {
        if (intervals[i].start <= merged.back().end) {
            merged.back().end = max(merged.back().end, intervals[i].end);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}

int main() {
    auto merged = mergeIntervals({{1, 3}, {2, 6}, {8, 10}});
    assert(merged.size() == 2);
    assert(merged[0].start == 1 && merged[0].end == 6);
    assert(merged[1].start == 8 && merged[1].end == 10);
}
```

### Python 3

```python
def merge_intervals(intervals: list[tuple[int, int]]) -> list[tuple[int, int]]:
    if not intervals:
        return []
    if any(start > end for start, end in intervals):
        raise ValueError("start exceeds end")
    ordered = sorted(intervals)
    merged = [ordered[0]]
    for start, end in ordered[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged


assert merge_intervals([(1, 3), (2, 6), (8, 10)]) == [(1, 6), (8, 10)]
assert merge_intervals([]) == []
```

<!-- algods:complexity -->
## Сортировка доминирует над линейным проходом

O(n log n) времени из-за сортировки и O(n) памяти для ответа. Сам проход — O(n).

<!-- algods:edge-cases -->
## Пустой ввод, касание границ и вложенные интервалы

Пустой ввод; касание `[1,2]` и `[2,3]` для закрытых интервалов объединяется; вложенные интервалы; одинаковые начала. Контракт требует `start <= end`, иначе реализация отклоняет интервал.

<!-- algods:tests -->
## Набор тестов на все виды пересечения

`[]`, `[[1,3],[2,6],[8,10]] -> [[1,6],[8,10]]`, вложение, касание границ, ошибочный `[5,2]`.

<!-- algods:recognition -->
## Как распознать задачу о временных диапазонах?

Объекты имеют начало и конец, требуется объединение, покрытие или выбор непересекающихся объектов.

<!-- algods:when-not-to-use -->
## Когда закрытые и полуоткрытые интервалы нельзя смешивать?

Условие пересечения зависит от модели: полуинтервалы `[l,r)` при `next.start == current.end` не пересекаются.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему достаточно сравнивать с последним интервалом?

Вопрос: почему не нужно сравнивать со всеми интервалами ответа? Ответ: они не пересекаются и отсортированы; пересечься может только последний.

<!-- algods:mini-check-2 -->
## Мини-проверка: зачем брать максимум правых границ?

Вопрос: почему end обновляется максимумом? Ответ: вложенный интервал не должен уменьшить уже покрытую правую границу.

<!-- algods:guided-practice -->
## Объедините три диапазона вручную

Объедините `[1,4],[0,2],[3,5],[8,9]`, показывая состояние `merged` после каждого отсортированного интервала.

<!-- algods:independent-practice -->
## Нормализуйте расписание без подсказки

### Задача 1

Объедините полуинтервалы `[l,r)`, где касание границ не считается пересечением, и сохраните результат отсортированным.

<!-- algods:takeaway -->
## После сортировки важен только последний объединённый блок

Сортировка превращает глобальную задачу пересечений в локальное сравнение с последним объединённым интервалом.
