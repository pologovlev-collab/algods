# 8 коротких видео — 9:16, 20–40 секунд

Сценарии готовы к производству, сами ролики не сгенерированы. Каждый — 30–35 секунд; читать голосом спокойно, паузы под демонстрацию. Seedance prompts описывают визуал и не полагаются на конкретный API/version capability: доступ к Seedance 2.5 не проверен. Если генератор поддерживает лишь короткий clip, создавать отдельные shots и склеивать в монтаже.

Общий монтаж: 1080×1920, 9:16; важный текст в центральных 80% ширины и между 15–75% высоты, затем проверить preview интерфейса площадки. Нейтральный светлый/тёмный фон, один синий акцент, без neon/gradient. Русский текст, числа, стрелки с точным смыслом и код — **добавлять вручную overlay**, не поручать генератору. Использовать subtitles с проверенной пунктуацией. Не показывать фальшивый UI, реальные статистики или личные вкладки.

YouTube description/VK caption/Telegram caption ниже готовы к копированию. Кликабельность ссылок в Shorts/Clips зависит от интерфейса: не говорить «нажми ссылку» поверх видео; разместить ссылку в разрешённом поле профиля/описания. Сохранить UTM и указать, где она размещена. CTA в озвучке ведёт к полезному следующему шагу.

## 1. Binary Search — binary-search-log

Длительность: 30 сек. Target: `https://algods.ru/reference/binary-search/`.

**Hook 0–3:** «Почему бинарный поиск — O(log n)?»

**Voiceover (полностью):**
```text
Почему бинарный поиск — O(log n)? Потому что правильное сравнение убирает примерно половину кандидатов. Миллион элементов превращается в пятьсот тысяч, затем в двести пятьдесят. Примерно двадцать делений пополам оставляют один кандидат. Но это работает при порядке данных или монотонной проверке, а доступ к середине должен быть дешёвым. Сортировка — отдельная работа. В AlgoDS есть короткий пример и код на C++ и Python.
```

**Storyboard / overlays:**
- 0–3: крупно hook; пустой ряд объектов без символов.
- 3–10: ряд сокращается вдвое дважды. Overlay «1 000 000 → 500 000 → 250 000».
- 10–18: быстрые последующие сокращения. Overlay «Около 20 делений», без обещания ровно 20 сравнений для каждого контракта.
- 18–25: два условия рядом: «Порядок / монотонность», «Доступ к mid: O(1)».
- 25–30: screen recording реального reference, переключить язык. Overlay «Разобрать инвариант · algods.ru»; CTA как в voiceover.

**Seedance prompt:** `Vertical 9:16 educational motion shot, 7 seconds. A clean horizontal row of identical neutral tiles, one half gently dims and disappears, remaining half recenters, repeat once. Restrained navy and blue, plain light background, fixed camera, clear discrete timing. No text or numbers; exact numeric labels will be added in editing.`

**Negative guidance:** не генерировать код/цифры; не рисовать BST; не заявлять ускорение без sorted input. Последний shot — screen recording, не generation. Запись compact code после deploy 007, либо локальный preview с пометкой черновика при подготовке.

**YouTube title:** Почему бинарный поиск — O(log n)?

**YouTube description / UTM:**
```text
Сужение диапазона, условия и короткий код C++17/Python 3 в AlgoDS, моём бесплатном учебном проекте:
https://algods.ru/reference/binary-search/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=binary-search-log
```
**VK caption / UTM:**
```text
Половину кандидатов можно исключать только обоснованно. Инвариант и код в моём AlgoDS:
https://algods.ru/reference/binary-search/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=binary-search-log
```
**Telegram caption / UTM:**
```text
Почему поиск логарифмический и где нужны условия — короткий разбор в моём AlgoDS:
https://algods.ru/reference/binary-search/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=binary-search-log
```

## 2. Two Pointers — two-pointers-linear

Длительность: 32 сек. Target: `https://algods.ru/reference/two-pointers/`.

**Hook 0–3:** «Не все пары нужно проверять».

**Voiceover:**
```text
Не все пары нужно проверять. В отсортированном массиве ищем сумму шесть. Один плюс семь — восемь: убираем правый элемент. Один плюс четыре — пять: убираем левый. Два плюс четыре — ответ. Порядок позволяет доказать каждый сдвиг: исключённый элемент уже не даст нужную пару. Границы только сближаются, поэтому сдвигов линейное число. Без сортировки этот аргумент не работает. Пример обеих реализаций — в AlgoDS.
```

**Storyboard / overlays:**
- 0–3: hook на фоне 4 пустых tiles.
- 3–10: точный монтаж массива «1 2 4 7», target 6, указатели на концах; overlay «1 + 7 = 8 → right--».
- 10–17: overlay «1 + 4 = 5 → left++»; следующий shot «2 + 4 = 6».
- 17–25: выделить область между границами, overlay «Сдвиг не теряет ответ · sorted input».
- 25–32: reference code screen recording; overlay «O(n) поиск · сортировка отдельно · algods.ru»; CTA «Посмотрите доказательство сдвига».

**Seedance prompt:** `Vertical 9:16, 6-second clean motion background for an algorithm explanation. Four blank tiles in one row; two small blue markers begin at the outer tiles, the right marker moves one tile inward, pause, then the left marker moves one tile inward. Static camera, no glyphs or text, restrained technical presentation.`

**Negative guidance:** точные значения/суммы/стрелки — overlay. Не анимировать исчезновение обоих элементов одновременно. Не обещать O(n) включая сортировку; код/interactive lab снять на AlgoDS.

**YouTube title:** Два указателя: почему иногда O(n) вместо O(n²)
**YouTube description:**
```text
Пара в отсортированном массиве: почему сдвиг безопасен. Мой AlgoDS, C++17 и Python 3:
https://algods.ru/reference/two-pointers/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=two-pointers-linear
```
**VK caption:**
```text
Порядок данных помогает исключить целую группу пар. Доказательство и код в моём AlgoDS:
https://algods.ru/reference/two-pointers/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=two-pointers-linear
```
**Telegram caption:**
```text
Линейное число сдвигов вместо перебора пар — при доказанных условиях. Мой AlgoDS:
https://algods.ru/reference/two-pointers/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=two-pointers-linear
```

## 3. Sliding Window — window-conditions

Длительность: 35 сек. Target: `https://algods.ru/reference/sliding-window/`.

**Hook 0–3:** «Окно не работает по одному слову “подмассив”».

**Voiceover:**
```text
Окно не работает по одному слову «подмассив». Для суммы фрагмента фиксированной длины вычитаем уходящий элемент и добавляем новый. Это работает и с отрицательными числами. Переменное окно требует отдельного доказательства. Возьмём четыре и минус три, порог два. Если сразу удалить четвёрку за превышение, потеряем допустимое окно суммы один. Сначала проверьте условие сдвига, потом применяйте шаблон. Оба случая разобраны в AlgoDS.
```

**Storyboard / overlays:**
- 0–3: hook, крупное «Подмассив ≠ готовое решение».
- 3–12: moving rectangle над массивом; overlay «Сумма: − уходящий + входящий».
- 12–18: label «Фиксированная длина: знак чисел не мешает».
- 18–28: точный монтаж [4, −3], порог 2, показать сумму 1 и длину 2. Overlay «Раннее удаление 4 теряет ответ».
- 28–35: screen recording intro reference, CTA «Проверьте условия окна в AlgoDS».

**Seedance prompt:** `Vertical 9:16, 7 seconds. A thin blue rectangular outline spans three blank tiles in a horizontal row of six. Slide the outline exactly one tile to the right; old left tile dims, new right tile highlights. Calm minimal educational animation, no numbers, letters or UI, fixed camera.`

**Negative guidance:** не смешивать fixed sum с variable uniqueness; числа/контрпример overlay. Уникальность лучше снять в existing lesson lab, сохранив реальные состояния; не делать fake generated lab.

**YouTube title:** Скользящее окно: когда работает, а когда теряет ответ
**YouTube description:**
```text
Фиксированное окно и ограничения переменного окна. Пример и код в моём AlgoDS:
https://algods.ru/reference/sliding-window/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=window-conditions
```
**VK caption:**
```text
Отрицательные числа не мешают фиксированному окну, но могут сломать сжатие по сумме. Мой AlgoDS:
https://algods.ru/reference/sliding-window/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=window-conditions
```
**Telegram caption:**
```text
Один маленький контрпример полезнее слепого шаблона. Разбор окна в моём AlgoDS:
https://algods.ru/reference/sliding-window/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=window-conditions
```

## 4. Big O — n-log-n

Длительность: 30 сек. Target: `https://algods.ru/big-o/`.

**Hook 0–3:** «Откуда берётся n log n?»

**Voiceover:**
```text
Откуда берётся n log n? Представьте сортировку слиянием. Разбиение пополам даёт логарифмическое число уровней. На каждом уровне суммарно обрабатываем линейное число элементов. Получаем n умножить на log n. Это оценка роста работы, а не секунд: сравнение элементов тоже имеет цену. Дополнительная память обычной сортировки слиянием линейная. В AlgoDS есть таблица времени и памяти с условиями каждой оценки.
```

**Storyboard / overlays:**
- 0–3: hook.
- 3–13: ветвление blank tiles на 1/2/4 блоки, overlay «O(log n) уровней».
- 13–21: scan каждого уровня целиком, overlay «O(n) работы на уровень».
- 21–26: «O(n log n) · сравнение O(1)», затем «Память обычного merge sort: O(n)».
- 26–30: screenshot таблицы Big O, CTA «Сверьте оценку в AlgoDS».

**Seedance prompt:** `Vertical 9:16, 8 seconds. Abstract merge-sort partition diagram without text: one row of eight blank tiles splits into two groups of four then four groups of two, aligned in three horizontal levels. Gentle blue highlights sweep across each entire level. Flat restrained palette, no numeric labels, no flashy effects.`

**Negative guidance:** не обещать точное время; не рисовать logarithm curve как доказательство; формулу и память добавить overlay. Таблица — screen recording, не генерировать текст.

**YouTube title:** Что означает O(n log n): пример merge sort
**YouTube description:**
```text
Число уровней × работа на уровень. Таблица Big O и assumptions в моём AlgoDS:
https://algods.ru/big-o/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=n-log-n
```
**VK caption:**
```text
O(n log n) — про рост работы, не секунды. Время и память разобраны в моём AlgoDS:
https://algods.ru/big-o/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=n-log-n
```
**Telegram caption:**
```text
Почему merge sort даёт n log n и какую память требует — памятка в моём AlgoDS:
https://algods.ru/big-o/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=n-log-n
```

## 5. BFS vs DFS — bfs-dfs

Длительность: 32 сек. Target: `https://algods.ru/algorithm-patterns/` (разделы bfs/dfs).

**Hook 0–3:** «Первый найденный путь не всегда кратчайший».

**Voiceover:**
```text
Первый найденный путь не всегда кратчайший. DFS идёт по ветви в глубину и может прийти к цели длинным маршрутом. BFS расширяет слои расстояния: в невзвешенном графе он находит путь с минимальным числом рёбер. Для простого обхода полезны оба. Если веса разные, обычный BFS уже не учитывает стоимость. Сначала назовите вопрос задачи и модель графа. В AlgoDS есть признаки выбора и ссылки на оба урока.
```

**Storyboard / overlays:**
- 0–3: hook на blank graph.
- 3–12: ручная схема S→A→B→T и S→T; DFS по выбранному порядку идёт длинной веткой. Overlay «DFS: глубина · первый путь ≠ кратчайший».
- 12–22: BFS first layer содержит T, overlay «BFS: минимальное число рёбер · невзвешенный граф».
- 22–27: один edge получает вес, overlay «Разные веса → проверить другой алгоритм».
- 27–32: screen recording guide разделов BFS/DFS; CTA «Проверьте модель графа в AlgoDS».

**Seedance prompt:** `Vertical 9:16, 6-second neutral background, five blank circular nodes connected by simple thin lines. Soft blue light travels along one branch then stops. Stable node positions, flat diagram, no labels, weights or invented interfaces. Precise graph animation will be composited separately.`

**Negative guidance:** граф с точными рёбрами лучше создать вручную или записать existing graph lab; не доверять generated topology/visited. Не говорить «DFS всегда медленнее BFS».

**YouTube title:** BFS или DFS? Сначала определите задачу
**YouTube description:**
```text
Кратчайший путь по числу рёбер и обход в глубину — разные задачи. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=bfs-dfs
```
**VK caption:**
```text
BFS гарантирует минимум рёбер в невзвешенном графе; первый путь DFS такой гарантии не даёт. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=bfs-dfs
```
**Telegram caption:**
```text
Выбираем BFS/DFS по вопросу задачи и модели графа. Памятка моего AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=bfs-dfs
```

## 6. Heap — heap-priority

Длительность: 32 сек. Target: `https://algods.ru/algorithm-patterns/` (heap).

**Hook 0–3:** «Нужен следующий минимум — сортировать всё?»

**Voiceover:**
```text
Нужен следующий минимум, а кандидаты постоянно добавляются? Проверьте кучу. Она держит экстремум в корне, но не сортирует все элементы. Вершина читается за O(1), извлечение восстанавливает порядок за O(log n). Просеивание при вставке тоже логарифмическое; расширение массива надо учитывать отдельно. C++ priority_queue по умолчанию даёт максимум, обычный Python heapq — минимум. В AlgoDS есть ориентир, когда куча полезнее сортировки.
```

**Storyboard / overlays:**
- 0–3: hook, arriving blank tokens.
- 3–12: корень min-heap highlighted, overlay «Экстремум в корне · остальное не отсортировано».
- 12–22: extract root, restore order, overlay «Вершина O(1) · извлечение O(log n)».
- 22–27: «C++ default: max · Python heapq: min».
- 27–32: actual guide heap section; CTA «Проверьте, нужен ли полный порядок».

**Seedance prompt:** `Vertical 9:16, 7 seconds. Minimal blank binary-tree diagram with seven circles. Highlight the root in blue, remove it, move one blank token upward and show a gentle downward path. No values, letters, code or UI. Preserve a clean fixed composition; exact heap states will be shown in screen recording.`

**Negative guidance:** не показывать invented heap values/sorted array; корректное просеивание снять в lab, если доступно, либо ручная animation. Не выдавать вторую ячейку за второй минимум.

**YouTube title:** Куча и priority queue: когда не нужна полная сортировка
**YouTube description:**
```text
Экстремум, стоимость операций и отличие C++/Python defaults. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=heap-priority
```
**VK caption:**
```text
Куча поддерживает следующий экстремум, не полный порядок. Разбор выбора в моём AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=heap-priority
```
**Telegram caption:**
```text
Что ускоряет priority queue и где не заменяет сортировку. Памятка моего AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=heap-priority
```

## 7. DP — dp-state-transition

Длительность: 35 сек. Target: `https://algods.ru/algorithm-patterns/` (dynamic-programming).

**Hook 0–3:** «DP начинается не с массива dp».

**Voiceover:**
```text
DP начинается не с массива dp, а с вопроса состояния. Сколько способов попасть на ступень i шагами один или два? Последний шаг пришёл с i минус один или i минус два: складываем число способов оттуда. Нужны базы: пустой путь считаем одним способом. Затем вычисляем по порядку зависимостей. Считайте состояния и цену переходов; большие числа тоже стоят времени. В AlgoDS есть разбор выбора DP и подробный урок.
```

**Storyboard / overlays:**
- 0–3: hook.
- 3–11: staircase blank blocks; overlay «dp[i] = число способов добраться до i».
- 11–21: manually place arrows i−1/i−2→i, overlay «dp[i] = dp[i−1] + dp[i−2]».
- 21–28: «dp[0] = 1 · dp[1] = 1 · порядок зависимостей».
- 28–35: guide/lesson screen recording; CTA «Сформулируйте состояние до кода».

**Seedance prompt:** `Vertical 9:16, 7 seconds. A clean staircase of five blank blocks on a plain background. Two thin blue arcs approach the same block from the preceding two blocks. Slow, readable educational motion, fixed camera, no math symbols, text or numerals; exact recurrence is an editing overlay.`

**Negative guidance:** не генерировать формулу; не обещать O(1) времени за счёт memoization; не забывать bases/разрядность. Existing DP lab предпочтительнее для вычисления реальных состояний.

**YouTube title:** DP: состояние, база и переход до первой строки кода
**YouTube description:**
```text
Число способов, базы и порядок вычисления. Диагностика DP в моём AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=dp-state-transition
```
**VK caption:**
```text
Сначала вопрос ячейки, потом база и переход. Памятка и урок DP в моём AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=dp-state-transition
```
**Telegram caption:**
```text
DP не определяется одним словом в условии: ищем повторяющиеся подзадачи. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=dp-state-transition
```

## 8. Выбор алгоритма — choose-algorithm

Длительность: 30 сек. Target: `https://algods.ru/algorithm-patterns/`.

**Hook 0–3:** «n большое. Но какой алгоритм выбрать?»

**Voiceover:**
```text
n большое. Но какой алгоритм выбрать? Ограничения помогают отвергнуть медленный перебор, а не назвать замену. Что ищем: пару, окно или путь? Какое свойство гарантировано? Что повторяется? Какое состояние уберёт повторение? Наконец, докажите инвариант и попробуйте сломать идею маленьким примером. Так название паттерна становится итогом рассуждения. В AlgoDS есть памятка с сигналами и контрпримерами — начните с неё.
```

**Storyboard / overlays:**
- 0–3: hook.
- 3–9: «Форма ответа: пара / фрагмент / путь».
- 9–15: «Свойства: порядок / знак / веса».
- 15–22: «Перебор → повторение → состояние».
- 22–26: «Инвариант + контрпример».
- 26–30: screen recording пяти вопросов guide, CTA «Откройте памятку выбора».

**Seedance prompt:** `Vertical 9:16, 6-second restrained abstract flow background. Five empty outlined rectangles appear in a clear top-to-bottom sequence linked with thin blue arrows. Plain background, generous spacing, static camera, no labels or icons. All Russian wording added as exact overlays later.`

**Negative guidance:** не выдавать keyword-to-pattern table за универсальный алгоритм; не обещать «любую задачу за 30 секунд». Реальная guide page в final shot, без generated browser.

**YouTube title:** Как выбрать алгоритм: пять вопросов до кода
**YouTube description:**
```text
Форма ответа, гарантии данных, повторение, состояние и контрпример. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=youtube&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=choose-algorithm
```
**VK caption:**
```text
Размер n помогает отбрасывать идеи; свойства данных выбирают технику. Памятка моего AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=vk&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=choose-algorithm
```
**Telegram caption:**
```text
Пять вопросов перед реализацией и контрпримеры для основных паттернов. Мой AlgoDS:
https://algods.ru/algorithm-patterns/?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=choose-algorithm
```

## Финальная проверка перед upload

Проверить duration, safe-area и readable overlays на телефоне; точность чисел/знаков; совпадение animation с озвучкой; captions без обещаний; UTM из таблицы. Для labs записывать фактическое поведение AlgoDS, не изменяя lab logic. Ролики не требуют покупки новых tools или автоматической публикации.
