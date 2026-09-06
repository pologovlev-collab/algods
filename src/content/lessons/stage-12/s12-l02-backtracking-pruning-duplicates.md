---
{
  "id": "s12-l02",
  "slug": "backtracking-pruning-duplicates",
  "title": "Отсечения, дубликаты и мутация состояния",
  "stage": 12,
  "order": 2,
  "prerequisites": [
    "s12-l01",
    "s07-l01"
  ],
  "core": true,
  "patterns": [
    "backtracking"
  ],
  "summary": "В комбинациях положительных чисел сортировка одновременно открывает безопасный break по сумме и соседний пропуск одинаковых ветвей.",
  "outcomes": [
    "отличать дубликаты на одном уровне от повторов на разных уровнях",
    "применять отсечение только после доказательства невозможности ветви"
  ],
  "practice": {
    "miniChecks": 2,
    "guidedExercises": 1,
    "independentExercises": 1
  }
}
---
# Отсечения, дубликаты и мутация состояния

Трассировка `[1,1,2,5]`, target 3: после выбора первого 1 ветвь со вторым 1 получает remaining 1 и отсекается перед 2; соседняя ветвь выбирает 2 и даёт ответ `[1,2]`. Второй 1 на корневом уровне пропускается, а 5 завершает цикл как слишком большой.

<!-- algods:problem-shape -->
## Как найти уникальные комбинации с заданной суммой?

Найти уникальные комбинации положительных кандидатов с суммой target, используя каждый индекс не более одного раза.

<!-- algods:brute-force -->
## Все подмножества с фильтрацией и set

Сгенерировать все 2^n подмножества, посчитать сумму каждого и удалить повторяющиеся комбинации через set.

<!-- algods:bottleneck -->
## Где возникают заведомо лишние и повторные ветви?

Перебор доходит до листьев даже после превышения target и полностью вычисляет одинаковые ветви равных кандидатов.

<!-- algods:key-observation -->
## Сортировка даёт break и пропуск дубля на одной глубине

После сортировки `value > remaining` позволяет сделать break для всех следующих значений, а равный кандидат на одной глубине создаёт уже исследованную комбинацию.

<!-- algods:invariant-state -->
## Что означает search(start, remaining)?

В `search(start, remaining)` path отсортирован, его сумма равна target-remaining, а каждый следующий индекс больше уже выбранных.

<!-- algods:algorithm -->
## Выбираем индекс один раз, отсекаем и откатываем

Отсортировать. При remaining=0 сохранить path. Перебирать i от start: пропустить равное значение на той же глубине, сделать break при value>remaining, затем choose, `search(i+1, remaining-value)`, undo.

<!-- algods:implementation -->
## Комбинации с pruning на C++17 и Python 3

### C++17

```cpp
#include <algorithm>
#include <cassert>
#include <stdexcept>
#include <vector>
using namespace std;

void search(
    const vector<int>& values,
    int start,
    int remaining,
    vector<int>& path,
    vector<vector<int>>& answer
) {
    if (remaining == 0) {
        answer.push_back(path);
        return;
    }
    for (int i = start; i < static_cast<int>(values.size()); ++i) {
        if (i > start && values[i] == values[i - 1]) continue;
        if (values[i] > remaining) break;
        path.push_back(values[i]);
        search(values, i + 1, remaining - values[i], path, answer);
        path.pop_back();
    }
}

vector<vector<int>> combinations(vector<int> values, int target) {
    if (target < 0) throw invalid_argument("negative target");
    for (int value : values) {
        if (value <= 0) throw invalid_argument("candidates must be positive");
    }
    sort(values.begin(), values.end());
    vector<int> path;
    vector<vector<int>> answer;
    search(values, 0, target, path, answer);
    return answer;
}

int main() {
    assert((combinations({1, 1, 2, 5}, 3) == vector<vector<int>>{{1, 2}}));
    assert((combinations({1, 2, 2, 3}, 4) == vector<vector<int>>{{1, 3}, {2, 2}}));
}
```

### Python 3

```python
def combinations(values: list[int], target: int) -> list[list[int]]:
    if target < 0:
        raise ValueError("negative target")
    if any(value <= 0 for value in values):
        raise ValueError("candidates must be positive")
    ordered = sorted(values)
    answer: list[list[int]] = []
    path: list[int] = []

    def search(start: int, remaining: int) -> None:
        if remaining == 0:
            answer.append(path.copy())
            return
        for index in range(start, len(ordered)):
            if index > start and ordered[index] == ordered[index - 1]:
                continue
            if ordered[index] > remaining:
                break
            path.append(ordered[index])
            search(index + 1, remaining - ordered[index])
            path.pop()

    search(0, target)
    return answer


assert combinations([1, 1, 2, 5], 3) == [[1, 2]]
assert combinations([1, 2, 2, 3], 4) == [[1, 3], [2, 2]]
```

<!-- algods:complexity -->
## Экспоненциальная граница и польза раннего отсечения

O(n·2^n) в грубой верхней оценке с копированием ответов; фактическое дерево уменьшают break и пропуск дублей. Стек/path O(n), результат считается отдельно.

<!-- algods:edge-cases -->
## Положительность кандидатов, дубликаты и target 0

target=0 даёт пустую комбинацию; пустой вход; все кандидаты больше target; дубликаты. Контракт отклоняет неположительный кандидат и отрицательный target; только поэтому отсортированный порядок делает break корректным.

<!-- algods:tests -->
## Тесты на уникальные ответы и пустой результат

`[1,1,2,5],3 -> [[1,2]]`, `[1,2,2,3],4 -> [[1,3],[2,2]]`, target 0, решения нет, неположительный кандидат отклоняется.

<!-- algods:recognition -->
## Сигналы для pruning в дереве решений

Ищутся неупорядоченные комбинации под ограничением, кандидаты положительны, а сортировка позволяет доказать невозможность продолжения.

<!-- algods:when-not-to-use -->
## Когда break неверен из-за отрицательных чисел?

При отрицательных значениях `value > remaining` не доказывает бесполезность следующих ветвей; break использовать нельзя.

<!-- algods:mini-check-1 -->
## Мини-проверка: почему пропускается дубль только на глубине?

Вопрос: почему условие использует `i > start`, а не `i > 0`? Ответ: повтор запрещён только как альтернативный выбор на одной глубине.

<!-- algods:mini-check-2 -->
## Мини-проверка: когда допустим break по превышению суммы?

Вопрос: можно ли делать break по превышению суммы без сортировки и положительных чисел? Ответ: нет; отсечение требует монотонного доказательства.

<!-- algods:guided-practice -->
## Проследите отсечения для target 3

Для `[1,1,2,4]`, target 5 отметьте отдельными цветами ветвь-дубликат, успешный remaining=0 и первый безопасный break.

<!-- algods:independent-practice -->
## Найдите комбинации размера k без подсказки

### Задача 1

Найдите все уникальные комбинации положительных кандидатов с суммой target, разрешая использовать каждый индекс не более одного раза.

<!-- algods:takeaway -->
## Корректное отсечение опирается на доказанный порядок

Дедупликация в бэктрекинге должна удалять одинаковые ветви одного уровня, а не запрещать повторяющиеся значения в пути.
