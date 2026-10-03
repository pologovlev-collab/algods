import type { ReferenceCodeExample } from './reference-topics';

export interface ReferenceQuickAnswer {
  seoTitle: string;
  seoDescription: string;
  definition: string;
  observation: string;
  invariant: string;
  trace: string[];
  limits: string[];
  checks: string[];
  codeExamples: ReferenceCodeExample[];
  links: { href: string; label: string }[];
}

export const referenceQuickAnswers: Partial<Record<string, ReferenceQuickAnswer>> = {
  'binary-search': {
    seoTitle: 'Бинарный поиск: алгоритм, O(log n), код C++ и Python — AlgoDS',
    seoDescription: 'Бинарный поиск в отсортированном массиве: как сужать диапазон, почему O(log n), lower bound и повторы. Короткий код C++17 и Python 3, ошибки и уроки.',
    definition: 'Бинарный поиск на каждом шаге исключает примерно половину кандидатов. Для поиска в массиве нужен порядок: здесь массив отсортирован по неубыванию. Более общий случай — монотонный предикат с одной границей false → true.',
    observation: 'Линейный поиск проверяет до n элементов. В отсортированном массиве сравнение середины с target позволяет сразу отбросить часть значений. Покажем lower bound: первый индекс, где a[i] ≥ target; если такого элемента нет, результат n.',
    invariant: 'Все индексы < left содержат значения < target; все индексы ≥ right содержат значения ≥ target. Не классифицированы элементы [left, right), а искомая позиция остаётся в [left, right], включая n. При left = right граница найдена.',
    trace: [
      'a = [1, 3, 3, 8], target = 3. left = 0, right = 4; mid = 2, a[mid] = 3: сохраняем середину кандидатом, right = 2.',
      'mid = 1, a[mid] = 3: right = 1. Затем mid = 0, a[mid] = 1: left = 1.',
      'left = right = 1: получили первое вхождение 3. Для точного поиска нужно проверить i < n и a[i] == target.',
    ],
    limits: [
      'Пустой массив возвращает 0; если target больше всех элементов, возвращается n. Не читать a[n]. Повторы не мешают lower bound находить первый подходящий индекс.',
      'Каждый шаг сокращает неклассифицированный диапазон примерно вдвое: O(log n) времени при O(1) доступе к середине и сравнении; дополнительная память O(1). Сортировка исходного массива — отдельная работа, обычно O(n log n). Для одного запроса линейный поиск может быть выгоднее.',
      'C++: предполагаем, что размер массива помещается в int. Python: list поддерживает доступ по индексу; стоимость операций над большими целыми зависит от разрядности.',
      'Готовые функции: std::lower_bound в C++ и bisect_left в Python. Вставка в середину массива после поиска всё равно требует O(n) перемещений. Бинарное дерево поиска — другая структура данных.',
    ],
    checks: ['[] и target = 3 → 0', '[1, 3, 3, 8] и target = 3 → 1', '[1, 3, 3, 8] и target = 4 → 3', '[1, 3, 3, 8] и target = 9 → 4'],
    codeExamples: [
      { language: 'cpp', label: 'C++17: первый индекс с a[i] ≥ target', code: `#include <vector>

int first_not_less(const std::vector<int>& a, int target) {
    int left = 0;
    int right = static_cast<int>(a.size());
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (a[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}` },
      { language: 'python', label: 'Python 3: первый индекс с a[i] ≥ target', code: `def first_not_less(a, target):
    left, right = 0, len(a)
    while left < right:
        mid = left + (right - left) // 2
        if a[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left` },
    ],
    links: [
      { href: '/course/binary-search-invariant/', label: 'Полный урок: точный поиск и инвариант' },
      { href: '/course/binary-search-boundaries/', label: 'Границы, lower bound и повторы' },
      { href: '/course/binary-search-on-answer/', label: 'Бинарный поиск по ответу' },
      { href: '/practice/', label: 'Задачи и самостоятельная практика' },
    ],
  },
  'two-pointers': {
    seoTitle: 'Два указателя: метод, примеры C++ и Python — AlgoDS',
    seoDescription: 'Метод двух указателей: поиск пары в отсортированном массиве, безопасный сдвиг границ, O(n), направления движения и ограничения. Код C++17 и Python 3.',
    definition: 'Метод двух указателей хранит две позиции и использует свойства данных, чтобы не проверять все пары. Указатели могут идти навстречу или в одном направлении. Важно доказать, почему каждый сдвиг не пропускает ответ.',
    observation: 'Проверка всех пар требует O(n²). Если массив отсортирован, начинаем с крайних элементов: при слишком маленькой сумме можно исключить весь левый элемент, при слишком большой — весь правый. Ищем два разных индекса с заданной суммой.',
    invariant: 'Если подходящая пара ещё существует, оба её индекса лежат в [left, right]. При a[left] + a[right] < target любая пара текущего left с меньшим правым индексом тоже слишком мала. Симметрично при слишком большой сумме исключается right.',
    trace: [
      'a = [1, 2, 4, 7], target = 6. Крайняя пара 1 + 7 = 8: уменьшаем right.',
      '1 + 4 = 5: увеличиваем left. Теперь 2 + 4 = 6 — ответ найден.',
      'Если left >= right, различных индексов больше нет: возвращаем false.',
    ],
    limits: [
      'Не сортируем внутри примера: sorted input — предусловие. Указатели делают суммарно не больше n − 1 сдвигов: O(n) времени и O(1) дополнительной памяти. Если нужна сортировка, добавить её стоимость; исходные индексы при этом меняются.',
      'В одном направлении read/write подходят для уплотнения массива; left/right — для окна. Fast/slow в списке используется, например, для цикла и требует отдельного доказательства, а не аргумента суммы.',
      'На неотсортированном массиве сдвиг по сумме небезопасен. Если нужны исходные индексы без сортировки, рассмотрите хеширование. При фиксированной разрядности ключей оно может дать ожидаемое линейное время, но использует дополнительную память.',
      'В C++ сумма int расширяется до long long до сложения; размер должен помещаться в int. Python int расширяется автоматически, но арифметика не постоянна для неограниченно больших чисел.',
    ],
    checks: ['[] и target = 6 → false', '[3] и target = 6 → false', '[3, 3] и target = 6 → true', '[-4, -1, 2, 7] и target = 3 → true'],
    codeExamples: [
      { language: 'cpp', label: 'C++17: существует ли пара разных индексов', code: `#include <vector>

bool has_pair(const std::vector<int>& a, long long target) {
    int left = 0;
    int right = static_cast<int>(a.size()) - 1;
    while (left < right) {
        long long sum = static_cast<long long>(a[left]) + a[right];
        if (sum == target) return true;
        if (sum < target) {
            ++left;
        } else {
            --right;
        }
    }
    return false;
}` },
      { language: 'python', label: 'Python 3: существует ли пара разных индексов', code: `def has_pair(a, target):
    left, right = 0, len(a) - 1
    while left < right:
        total = a[left] + a[right]
        if total == target:
            return True
        if total < target:
            left += 1
        else:
            right -= 1
    return False` },
    ],
    links: [
      { href: '/course/opposite-two-pointers/', label: 'Полный урок: поиск пары и доказательство сдвига' },
      { href: '/reference/sliding-window/', label: 'Указатели в одном направлении: скользящее окно' },
      { href: '/practice/', label: 'Задачи и самостоятельная практика' },
    ],
  },
  'sliding-window': {
    seoTitle: 'Скользящее окно: алгоритм, код C++ и Python — AlgoDS',
    seoDescription: 'Скользящее окно (Sliding Window) для массивов и строк: фиксированная длина, обновление суммы, переменное окно и ограничения. Код C++17 и Python 3.',
    definition: 'Скользящее окно (Sliding Window) — алгоритмический паттерн для непрерывного фрагмента массива или строки: при сдвиге границ обновляем состояние, вместо того чтобы пересчитывать фрагмент заново. Здесь речь об алгоритмах, а не о протоколе TCP.',
    observation: 'Для максимальной суммы фрагмента длины k можно пересчитать каждую сумму за O(k), всего O(nk). Соседние окна имеют k − 1 общих элементов: вычтем уходящий и добавим входящий за O(1). Сортировка не требуется.',
    invariant: 'После обновления total равен сумме последних k элементов, а best — максимальной сумме среди уже рассмотренных окон. Фиксированное окно допускает отрицательные значения: решение не сжимает границу по условию суммы.',
    trace: [
      'a = [2, -1, 3, 4], k = 2. Первое окно [2, -1] даёт 1; best = 1.',
      'Уходит 2, приходит 3: total = 1 − 2 + 3 = 2. Затем уходит −1, приходит 4: total = 2 − (−1) + 4 = 7.',
      'Ответ 7. Если k < 1 или k > n, окна нет: C++ возвращает nullopt, Python — None.',
    ],
    limits: [
      'Первую сумму считаем за O(k), остальные обновляем за O(1): всего O(n) времени, O(1) дополнительной памяти при арифметике постоянной стоимости. Пример не создаёт срезы Python, которые добавили бы O(k) работы.',
      'Переменное окно требует другого инварианта: расширяем right и при нарушении условия двигаем left. Движения границ линейны, но стоимость состояния надо учитывать отдельно: частоты в хеш-таблице дают ожидаемую, не безусловную, оценку.',
      'Сжатие по превышению суммы работает для подходящих условий на неотрицательных числах. Контрпример с отрицательными: [4, -3], порог 2. Если удалить 4 сразу после превышения порога, потеряется допустимое окно суммы 1 длины 2.',
      'Непрерывность обязательна: подпоследовательность с пропусками не является окном. C++: размер помещается в int, суммы — в long long; преобразование перед вычитанием предотвращает переполнение int. Python: большие целые увеличивают стоимость арифметики.',
    ],
    checks: ['[2, -1, 3, 4], k = 2 → 7', '[-5, -2], k = 1 → -2, не 0', '[1, 2], k = 2 → 3', '[] или k = 0 или k > n → окна нет'],
    codeExamples: [
      { language: 'cpp', label: 'C++17: максимальная сумма окна длины k', code: `#include <algorithm>
#include <optional>
#include <vector>

std::optional<long long> max_window_sum(const std::vector<int>& a, int k) {
    int n = static_cast<int>(a.size());
    if (k < 1 || k > n) return std::nullopt;
    long long total = 0;
    for (int i = 0; i < k; ++i) total += a[i];
    long long best = total;
    for (int right = k; right < n; ++right) {
        total += static_cast<long long>(a[right]) - a[right - k];
        best = std::max(best, total);
    }
    return best;
}` },
      { language: 'python', label: 'Python 3: максимальная сумма окна длины k', code: `def max_window_sum(a, k):
    n = len(a)
    if k < 1 or k > n:
        return None
    total = 0
    for i in range(k):
        total += a[i]
    best = total
    for right in range(k, n):
        total += a[right] - a[right - k]
        best = max(best, total)
    return best` },
    ],
    links: [
      { href: '/course/fixed-sliding-window/', label: 'Полный урок: окно фиксированной длины' },
      { href: '/course/variable-sliding-window/', label: 'Переменное окно: подстрока без повторов' },
      { href: '/practice/', label: 'Задачи и самостоятельная практика' },
    ],
  },
};
