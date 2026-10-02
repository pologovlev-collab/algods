# SEO 006 final report

Date: 2026-10-03. Branch: `codex/algods-seo-006`. Base: `b95da25`.

SAFE TO CREATE PR: **YES**, based on the local gates below. No merge or deploy was performed.

Publication status: all three milestones are committed locally. Feature-branch push
was blocked by automatic approval review because the direct user request does not
explicitly authorize external publication. No push occurred; direct approval is pending.

## Scope and milestone commits

1. `ab9ab28` — reusable optional lesson metadata, breadcrumbs and safe JSON-LD.
2. `288375b` — three learning guides and a separate about page.
3. `chore: strengthen discoverability and SEO validation` — section metadata,
   contextual links, README, generated-output validation, final QA and this report.
   The final commit SHA is reported in the handoff and is available through `git log -3`.

There are exactly three new search landing pages plus the explicitly requested trust
page. The implementation extends the existing static Astro architecture, with no
new dependencies or guide-specific client JavaScript. See `seo-006-audit.md` for
the pre-implementation audit, staged plan and primary-source checks.

## Verification

| Check | Baseline | Final |
| --- | --- | --- |
| Astro check | 105 files, no diagnostics | 120 files, no diagnostics |
| Lint | PASS | PASS |
| Unit tests | 22 suites / 133 tests | 25 suites / 150 tests |
| Content | 54 lessons / 21 stages | 54 lessons / 21 stages |
| Executable lesson examples | 53 C++17 + 53 Python | 53 C++17 + 53 Python |
| Production build | 93 content pages | 97 content pages |
| Internal links, fragments, assets | 94 HTML files | 98 HTML files |
| Full Chromium E2E | 15/15 | 32/32 |
| Release layout audit | 6/6 widths | 6/6 widths |
| Generated-output SEO | audit only | 97 content pages / 0 issues |
| git diff --check | PASS | PASS |

Commands: `npm run verify`, `npm run test:e2e`, `npm run test:layout`,
`npm run validate:seo`, `npm run validate:links`, `git diff --check`.
The full verify includes check, lint, unit tests, content, compiled examples, build,
links and SEO validation in that order. Final full E2E was rerun after strengthening
the table visibility/focus check; it passed 32/32.

Viewport widths: 360, 390, 430, 768, 1024 and 1440 pixels. Each new route was also
checked in light and dark mode at all six widths, including console/page errors,
body overflow and footer link geometry. Mobile Big O checks confirm that the table
is wider than its local scroll region, visible, keyboard-focused and horizontally
scrollable using ArrowRight. Layout audit preserves detection of hidden/clipped
content; it does not rely only on body scrollWidth.

The release audit covered 423 route/viewport combinations: all 97 content
routes on each of three phone widths and 44 representative routes on each larger width.
Screenshots were inspected for all four desktop pages, mobile guide typography,
dark mode and the Big O table. Local logs and screenshot evidence are retained in
ignored `.tmp/seo-006-*` and `test-results/`; they are not product assets.

Initial sandbox attempts failed on Astro telemetry configuration and an existing
Python subprocess EPERM. Gates succeeded with telemetry disabled and the execution
permission required by the existing C++/Python/Chromium tools. No application code
was changed to bypass the sandbox. A new table test originally used End (vertical
scroll); it was corrected to ArrowRight and its focus/visibility assertions verified.

## SEO invariants

- All 97 content routes have a unique nonempty title and description, exactly one
  absolute canonical matching their path on https://algods.ru, and exactly one H1.
- No content page has accidental robots/googlebot/yandex noindex or none.
- All 97 content routes are present in the actual sitemap URL set resolved from
  the generated sitemap index. All four new routes exist in output and sitemap.
- 91 pages have a parseable BreadcrumbList: 54 lessons, 33 reference entries and
  four new pages. Visible names come from the same items as structured navigation.
  Absolute URLs, ordered positions and the current-page canonical are validated.
- Existing OpenGraph title/description/URL values remain aligned with metadata.
  Social images, Twitter tags, robots, sitemap generation, CNAME and canonical
  layout logic are preserved. No artificial title/description length gates.
- The standalone Yandex verification HTML is excluded as a machine verification
  asset, not treated as an indexable learning page.
- JSON-LD serialization escapes HTML tag delimiters, ampersands and line separators;
  adversarial closing-script text is covered by a round-trip test. No fake reviews,
  ratings, FAQ, authors, dates, or unsupported Course claims were added.

The validator targets controlled generated static HTML; it is not a general-purpose
HTML parser or a replacement for search-engine URL inspection. Its 10 unit cases
cover metadata omissions, relative/off-domain/wrong-path and duplicate canonical,
duplicate title/description, multiple H1, noindex, malformed JSON-LD, breadcrumb URLs,
missing output/sitemap routes, attribute order, comments and script text.

## New pages and strengthened section metadata

| Route | Title | Description | Structured data |
| --- | --- | --- | --- |
| / | AlgoDS — бесплатный курс по алгоритмам: C++ и Python | Русскоязычный курс по алгоритмам и структурам данных: 54 урока, C++17 и Python 3, карта знаний, практика и локальный прогресс без аккаунта. | None |
| /about/ | О проекте AlgoDS — бесплатный курс по алгоритмам | Как устроен AlgoDS: обучение на C++17 и Python 3, локальный прогресс, проверка примеров, подбор практики, исходный код и сообщения об ошибках. | BreadcrumbList |
| /algorithm-patterns/ | Паттерны алгоритмических задач: как выбрать подход — AlgoDS | Как выбрать технику по свойствам задачи: признаки, ограничения и контрпримеры для двух указателей, окна, бинарного поиска, BFS, DFS, greedy и DP. | BreadcrumbList |
| /big-o/ | Big O: сложность алгоритмов и структур данных — AlgoDS | Как оценивать время и память: классы Big O, таблица операций структур данных, размер входа, худший и амортизированный случай и типичные ошибки. | BreadcrumbList |
| /coding-interview/ | Алгоритмы для собеседования: roadmap подготовки — AlgoDS | Подготовка к алгоритмическому собеседованию по 21 этапу AlgoDS: структуры данных, паттерны, графы, DP, практика LeetCode 75 и повторение. | BreadcrumbList |
| /course/ | Курс по алгоритмам и структурам данных: C++ и Python — AlgoDS | 54 урока в 21 этапе: от ограничений и перебора к структурам данных, графам и DP. Примеры на C++17 и Python 3, инварианты и постепенная практика. | None |
| /leetcode-75/ | LeetCode 75: список задач и маршрут практики — AlgoDS | Официальный набор LeetCode 75 со ссылками на условия, связями с уроками AlgoDS и локальными статусами решений. Русскоязычный маршрут практики. | None |
| /practice/ | Практика алгоритмов: LeetCode, CodeRun и Codewars — AlgoDS | Каталог алгоритмических задач по этапам и режимам: работа с разбором, перенос паттерна и самостоятельное решение. Фильтры платформ и локальные статусы. | None |
| /reference/ | Справочник алгоритмов и структур данных: C++ и Python — AlgoDS | Сигналы задач, стоимость операций и границы применимости алгоритмов и структур данных. Краткие ориентиры со ссылками на уроки C++ и Python. | None |
| /roadmap/ | Roadmap алгоритмов и структур данных — AlgoDS | Карта 21 этапа AlgoDS: порядок изучения алгоритмов, зависимости между уроками и локальный прогресс от первых задач до подготовки к интервью. | None |

The LeetCode page deliberately says list and practice route rather than suggesting
that AlgoDS supplies translated full problem statements or solutions. The course
page does not promise to teach programming syntax.

## Ten curated lessons

| Lesson ID | Existing pedagogical H1 | Route | SEO title |
| --- | --- | --- | --- |
| s00-l01 | Ограничения как бюджет решения | /course/constraints-and-budgets/ | Big O и сложность алгоритмов: оценка по ограничениям — AlgoDS |
| s03-l01 | Два указателя навстречу | /course/opposite-two-pointers/ | Два указателя (Two Pointers): C++ и Python — AlgoDS |
| s04-l02 | Расширение, сжатие и инвариант окна | /course/variable-sliding-window/ | Скользящее окно (Sliding Window): C++ и Python — AlgoDS |
| s08-l01 | Точный бинарный поиск через инвариант | /course/binary-search-invariant/ | Бинарный поиск: инвариант, C++ и Python — AlgoDS |
| s08-l02 | Первая и последняя подходящая позиция | /course/binary-search-boundaries/ | Lower Bound и первое вхождение: C++ и Python — AlgoDS |
| s11-l01 | Куча и priority queue | /course/heap-priority-queue-model/ | Куча и приоритетная очередь: priority_queue и heapq — AlgoDS |
| s13-l02 | DFS, компоненты и циклы | /course/graph-dfs-components-cycles/ | DFS: обход графа, компоненты и циклы — AlgoDS |
| s13-l03 | BFS, кратчайший путь и несколько источников | /course/graph-bfs-shortest-multisource/ | BFS: кратчайший путь и несколько источников — AlgoDS |
| s13-l06 | Дейкстра для неотрицательных весов | /course/dijkstra-nonnegative-weights/ | Алгоритм Дейкстры: C++ и Python, неотрицательные веса — AlgoDS |
| s15-l01 | Определяем состояние DP | /course/dp-state-and-memoization/ | Динамическое программирование: состояние и мемоизация — AlgoDS |

All 54 lesson bodies and all original frontmatter fields match the base when the
optional SEO additions are excluded. IDs, URLs, H1s, summaries, code, prerequisites,
order and practice mappings are preserved. The remaining 44 lessons use the exact
existing title-suffix/summary fallback; overrides are independently tested.

## Internal linking

- Footer discovery links to Big O, pattern choice, interview preparation and about;
  the header remains unchanged.
- Course links to pattern choice and interview preparation. Reference index links
  to Big O and pattern choice. Roadmap, LeetCode 75 and Practice link to the interview
  guide with descriptive anchors.
- Stage 0–1 lesson sidebars link to Big O. Relevant pattern lessons link to the
  decision guide; stages 19–20 link to interview preparation.
- Relevant core reference entries link directly to matching guide sections; the
  problem-solving reference links to Big O.
- Big O links back to constraints, brute-force optimization, container costs and
  two pointers. The pattern guide derives 12 lesson/reference mappings from actual
  lesson and reference data and links to course stages and existing practice.
- Interview preparation derives all 21 stages in their existing order and links
  to course, roadmap, LeetCode 75, Practice, reference and both learning guides.
- About links to the curriculum, practice, local progress controls, public repository
  and GitHub issue form. No message or issue was submitted.

Contextual incoming links from existing page main content (excluding ubiquitous
footer links and links among new pages):

| Guide | Existing incoming routes |
| --- | --- |
| /big-o/ | 7: /reference/, /reference/problem-solving/, /course/sorting-recursion-language-semantics/, /course/invariants-edge-cases-tests/, /course/interview-containers-and-costs/, /course/constraints-and-budgets/, /course/complexity-and-brute-force/ |
| /algorithm-patterns/ | 44: /reference/, /reference/two-pointers/, /reference/stack/, /reference/sliding-window/, /reference/prefix-sum/, /reference/heap/, /reference/hashing/, /reference/greedy/, /reference/graph/, /reference/dynamic-programming/, /reference/binary-search/, /reference/backtracking/, /course/, /course/variable-sliding-window/, /course/top-k-streams-k-way-merge/, /course/stack-and-brackets/, /course/sequence-dp-lcs-edit/, /course/same-direction-fast-slow/, /course/prefix-sums-and-counts/, /course/prefix-hash-suffix-difference/, /course/opposite-two-pointers/, /course/monotonic-stack-and-deque/, /course/linked-list-merge-cycle/, /course/knapsack-and-subsequence-state/, /course/interval-greedy/, /course/heap-priority-queue-model/, /course/hash-lookup-and-membership/, /course/grid-and-two-dimensional-dp/, /course/greedy-choice-and-proof/, /course/graph-representation-and-grids/, /course/graph-dfs-components-cycles/, /course/graph-bfs-shortest-multisource/, /course/frequency-grouping-counting/, /course/fixed-sliding-window/, /course/dp-tabulation-and-order/, /course/dp-state-and-memoization/, /course/dp-one-dimensional-patterns/, /course/dijkstra-nonnegative-weights/, /course/bst-ordering-invariant/, /course/binary-search-on-answer/, /course/binary-search-invariant/, /course/binary-search-boundaries/, /course/backtracking-pruning-duplicates/, /course/backtracking-decision-tree/ |
| /coding-interview/ | 8: /roadmap/, /practice/, /leetcode-75/, /course/, /course/pattern-recognition-decision-process/, /course/mixed-pattern-practice/, /course/interview-simulation/, /course/graduation-and-review-loop/ |
| /about/ | 0: Footer discovery |

## Diff inventory

45 changed or added product/documentation/test files relative to the base:

- README.md
- docs/seo-006-audit.md
- docs/seo-006-report.md
- e2e/layout.spec.ts
- e2e/seo.spec.ts
- package.json
- scripts/lib/seo-validation.mjs
- scripts/validate-seo.mjs
- src/components/Breadcrumbs.astro
- src/components/Footer.astro
- src/components/ReferenceTopic.astro
- src/components/StructuredData.astro
- src/content.config.ts
- src/content/guides/about.md
- src/content/guides/big-o.md
- src/content/guides/coding-interview.md
- src/content/lessons/stage-00/s00-l01-constraints-and-budgets.md
- src/content/lessons/stage-03/s03-l01-opposite-two-pointers.md
- src/content/lessons/stage-04/s04-l02-variable-sliding-window.md
- src/content/lessons/stage-08/s08-l01-binary-search-invariant.md
- src/content/lessons/stage-08/s08-l02-binary-search-boundaries.md
- src/content/lessons/stage-11/s11-l01-heap-priority-queue-model.md
- src/content/lessons/stage-13/s13-l02-graph-dfs-components-cycles.md
- src/content/lessons/stage-13/s13-l03-graph-bfs-shortest-multisource.md
- src/content/lessons/stage-13/s13-l06-dijkstra-nonnegative-weights.md
- src/content/lessons/stage-15/s15-l01-dp-state-and-memoization.md
- src/data/pattern-guide.ts
- src/layouts/GuideLayout.astro
- src/lib/content.ts
- src/lib/seo.ts
- src/pages/about/index.astro
- src/pages/algorithm-patterns/index.astro
- src/pages/big-o/index.astro
- src/pages/coding-interview/index.astro
- src/pages/course/[slug].astro
- src/pages/course/index.astro
- src/pages/index.astro
- src/pages/leetcode-75/index.astro
- src/pages/practice/index.astro
- src/pages/reference/index.astro
- src/pages/roadmap/index.astro
- src/styles/guides.css
- tests/pattern-guide.test.ts
- tests/seo-validator.test.ts
- tests/seo.test.ts

Agent instructions, local reference collections, prompt archives, logs and screenshots
were not staged. No files were deleted and no existing subsystem was rebuilt.

## Preserved boundaries and remaining limitations

A protected-path diff is empty for public assets (including Metrica verification,
robots, CNAME and sw.js), BaseLayout/Metrica 108312356, Astro config, Pages workflows,
stage/pattern data, progress schema and IDs, practice corpus and all provider mappings,
labs, Search, learning-state scripts, theme architecture, global CSS and lockfile.
Local main remains at e93f0fc; origin/main was only read/fetched, not written.

No deployment, indexing request, production measurement or search-engine ranking
claim is made. Search visibility and organic traffic must be observed after a
separately approved deployment. Local Chromium checks do not prove full accessibility
compliance or all-browser equivalence. Remote CI was not observed. No author biography
or licence terms were invented.

Final review was a sequential self-review by the implementer, respecting the explicit
no-sub-agents instruction; it is weaker than an independent review. No unresolved
blocking findings or deferred product changes were identified.

## Complete generated metadata inventory

Canonical for every row is https://algods.ru plus the listed route. The following
values are extracted from generated HTML, including unchanged pages.

| Route | Title | Description | Structured data |
| --- | --- | --- | --- |
| / | AlgoDS — бесплатный курс по алгоритмам: C++ и Python | Русскоязычный курс по алгоритмам и структурам данных: 54 урока, C++17 и Python 3, карта знаний, практика и локальный прогресс без аккаунта. | None |
| /about/ | О проекте AlgoDS — бесплатный курс по алгоритмам | Как устроен AlgoDS: обучение на C++17 и Python 3, локальный прогресс, проверка примеров, подбор практики, исходный код и сообщения об ошибках. | BreadcrumbList |
| /algorithm-patterns/ | Паттерны алгоритмических задач: как выбрать подход — AlgoDS | Как выбрать технику по свойствам задачи: признаки, ограничения и контрпримеры для двух указателей, окна, бинарного поиска, BFS, DFS, greedy и DP. | BreadcrumbList |
| /big-o/ | Big O: сложность алгоритмов и структур данных — AlgoDS | Как оценивать время и память: классы Big O, таблица операций структур данных, размер входа, худший и амортизированный случай и типичные ошибки. | BreadcrumbList |
| /coding-interview/ | Алгоритмы для собеседования: roadmap подготовки — AlgoDS | Подготовка к алгоритмическому собеседованию по 21 этапу AlgoDS: структуры данных, паттерны, графы, DP, практика LeetCode 75 и повторение. | BreadcrumbList |
| /course/ | Курс по алгоритмам и структурам данных: C++ и Python — AlgoDS | 54 урока в 21 этапе: от ограничений и перебора к структурам данных, графам и DP. Примеры на C++17 и Python 3, инварианты и постепенная практика. | None |
| /course/arrays-strings-traversal/ | Обход массивов и строк — AlgoDS | Несколько агрегатов обновляются одним чтением элемента. | BreadcrumbList |
| /course/backtracking-decision-tree/ | Дерево решений: choose → recurse → undo — AlgoDS | Перестановка выбирает следующий неиспользованный элемент; комбинация выбирает следующий индекс только справа, а подмножество допускает include/exclude. | BreadcrumbList |
| /course/backtracking-pruning-duplicates/ | Отсечения, дубликаты и мутация состояния — AlgoDS | В комбинациях положительных чисел сортировка одновременно открывает безопасный break по сумме и соседний пропуск одинаковых ветвей. | BreadcrumbList |
| /course/binary-search-boundaries/ | Lower Bound и первое вхождение: C++ и Python — AlgoDS | Выводим граничный бинарный поиск: первая подходящая позиция, lower и upper bound, дубликаты, позиция вставки и корректный ответ n. | BreadcrumbList |
| /course/binary-search-invariant/ | Бинарный поиск: инвариант, C++ и Python — AlgoDS | Точный поиск в отсортированном массиве: закрытый диапазон, безопасное вычисление середины, сужение границ и проверка крайних случаев. | BreadcrumbList |
| /course/binary-search-on-answer/ | Поиск по ответу и монотонный предикат — AlgoDS | Если допустимость ответа монотонна, можно искать минимальное допустимое значение, не строя сам ответ напрямую. | BreadcrumbList |
| /course/bit-representation-and-operations/ | Биты, сдвиги и безопасные маски — AlgoDS | Маска с единственной единицей позволяет проверять конкретный бит, а операция x & (x - 1) удаляет младший установленный бит. | BreadcrumbList |
| /course/bst-ordering-invariant/ | Инвариант бинарного дерева поиска — AlgoDS | BST ускоряет поиск только пока каждый узел разделяет ключи на строго определённые области. | BreadcrumbList |
| /course/complexity-and-brute-force/ | От полного перебора к узкому месту — AlgoDS | Строим корректный перебор, называем повторяющуюся работу и затем оптимизируем. | BreadcrumbList |
| /course/constraints-and-budgets/ | Big O и сложность алгоритмов: оценка по ограничениям — AlgoDS | Как оценить время и память по размеру входа: сравнить линейный, квадратичный и экспоненциальный рост и отсеять слишком дорогие решения. | BreadcrumbList |
| /course/dijkstra-nonnegative-weights/ | Алгоритм Дейкстры: C++ и Python, неотрицательные веса — AlgoDS | Находим кратчайшие пути с приоритетной очередью: релаксация, устаревшие записи, неотрицательные веса и точная оценка lazy-heap. | BreadcrumbList |
| /course/dp-one-dimensional-patterns/ | Take/skip, число способов, min/max — AlgoDS | В задаче take/skip лучший ответ на префиксе получается из явного сравнения взять текущий элемент или сохранить лучший совместимый префикс. | BreadcrumbList |
| /course/dp-state-and-memoization/ | Динамическое программирование: состояние и мемоизация — AlgoDS | От повторяющегося дерева рекурсии к графу состояний: выбираем достаточное состояние DP и сохраняем ответы в C++ и Python. | BreadcrumbList |
| /course/dp-tabulation-and-order/ | Переход, база и порядок вычисления — AlgoDS | В табуляции состояние вычисляют только после всех состояний, от которых зависит его переход. | BreadcrumbList |
| /course/dsu-connectivity/ | DSU и динамическая связность — AlgoDS | DSU хранит каждую компоненту как дерево представителей и быстро поддерживает только объединения. | BreadcrumbList |
| /course/fixed-sliding-window/ | Окно фиксированного размера — AlgoDS | При сдвиге один элемент уходит и один приходит. | BreadcrumbList |
| /course/frequency-grouping-counting/ | Частоты, группировка и подсчёт — AlgoDS | Анаграммы имеют одинаковые частоты символов. | BreadcrumbList |
| /course/graduation-and-review-loop/ | Выпускной разбор и следующий цикл — AlgoDS | Выпуск подтверждается независимыми попытками, ясным объяснением и планом возврата к конкретной ошибке, а не числом решённых карточек. | BreadcrumbList |
| /course/graph-bfs-shortest-multisource/ | BFS: кратчайший путь и несколько источников — AlgoDS | Поиск в ширину на C++ и Python: слои невзвешенного графа, расстояния и multi-source BFS с общим стартовым слоем. | BreadcrumbList |
| /course/graph-dfs-components-cycles/ | DFS: обход графа, компоненты и циклы — AlgoDS | Поиск в глубину на C++ и Python: visited, компоненты связности и цикл в простом неориентированном графе с учётом родителя. | BreadcrumbList |
| /course/graph-representation-and-grids/ | Графы, списки смежности и сетки — AlgoDS | Список смежности хранит только существующие рёбра и делает соседей вершины доступными за время, пропорциональное её степени. | BreadcrumbList |
| /course/greedy-choice-and-proof/ | Когда локальный выбор безопасен — AlgoDS | Жадный шаг допустим лишь тогда, когда его можно обменять на шаг из любого оптимального решения без ухудшения ответа. | BreadcrumbList |
| /course/grid-and-two-dimensional-dp/ | DP по сетке и двум координатам — AlgoDS | В монотонной сетке dp[row][col] хранит число путей до клетки из уже посчитанных верхней и левой клеток с учётом препятствий. | BreadcrumbList |
| /course/hash-lookup-and-membership/ | Быстрый поиск: set и map — AlgoDS | `target-x` можно проверять среди уже просмотренных. | BreadcrumbList |
| /course/heap-priority-queue-model/ | Куча и приоритетная очередь: priority_queue и heapq — AlgoDS | Разбираем инвариант min-heap, просеивание и линейный heapify; сопоставляем учебную кучу с priority_queue в C++17 и heapq в Python. | BreadcrumbList |
| /course/interval-greedy/ | Сортировка + жадный выбор на интервалах — AlgoDS | Если нужна максимальная совместимая подборка, выбор самого раннего окончания оставляет максимум времени для будущих интервалов. | BreadcrumbList |
| /course/intervals-and-overlaps/ | Интервалы, пересечения и объединение — AlgoDS | После сортировки по началу достаточно сравнивать новый интервал с последним уже объединённым. | BreadcrumbList |
| /course/interview-containers-and-costs/ | Контейнеры и стоимость операций — AlgoDS | Стоимость операции следует из внутреннего устройства контейнера: плотного массива, хеш-таблицы или очереди. | BreadcrumbList |
| /course/interview-simulation/ | Таймированная симуляция собеседования — AlgoDS | На таймированной попытке сначала формулируем контракт, медленный эталон, состояние и альтернативу; разбор открывается только после собственного решения. | BreadcrumbList |
| /course/invariants-edge-cases-tests/ | Инварианты, граничные случаи и тесты — AlgoDS | Используем инвариант как доказательство и превращаем риски в тесты. | BreadcrumbList |
| /course/knapsack-and-subsequence-state/ | Рюкзак и состояние подпоследовательности — AlgoDS | В 0/1-рюкзаке dp[w] хранит лучшую ценность при вместимости w после уже обработанных предметов, а обратный обход не даёт взять предмет повторно. | BreadcrumbList |
| /course/linked-list-merge-cycle/ | Слияние, разворот и обнаружение цикла — AlgoDS | Разворот списка сохраняет следующий узел до смены стрелки, а алгоритм Флойда обнаруживает цикл по встрече указателей с разной скоростью. | BreadcrumbList |
| /course/linked-list-relinking/ | Узлы, dummy и безопасное перенаправление ссылок — AlgoDS | Dummy-узел убирает особый случай первой вставки, а хвост результата всегда указывает на последний уже слитый узел. | BreadcrumbList |
| /course/merge-and-quicksort-reasoning/ | Слияние, разбиение и гарантии сортировок — AlgoDS | Merge sort получает гарантию O(n log n), потому что делит задачу по глубине и линейно сливает каждый уровень. | BreadcrumbList |
| /course/mixed-pattern-practice/ | Проверяем гипотезу о пороге — AlgoDS | Набор возможных ответов можно искать по значению, если проверка кандидата однозначна и остаётся истинной при движении в одну сторону. | BreadcrumbList |
| /course/monotonic-stack-and-deque/ | Монотонный стек и монотонный дек — AlgoDS | Монотонный стек удаляет кандидата именно тогда, когда текущий элемент впервые становится для него ответом. | BreadcrumbList |
| /course/opposite-two-pointers/ | Два указателя (Two Pointers): C++ и Python — AlgoDS | Поиск пары в отсортированном массиве: от перебора к двум указателям, доказательство сдвига границ, сложность и крайние случаи. | BreadcrumbList |
| /course/pattern-recognition-decision-process/ | Диагностика задачи без названия паттерна — AlgoDS | Сначала записываем форму входа, медленный эталон и нужное состояние; имя приёма появляется только после такой диагностики. | BreadcrumbList |
| /course/prefix-hash-suffix-difference/ | Префиксные и суффиксные накопления — AlgoDS | Произведение кроме текущего элемента собирается из левого префикса и правого суффикса. | BreadcrumbList |
| /course/prefix-sums-and-counts/ | Префиксные суммы и счётчики — AlgoDS | Сумма диапазона — разность двух префиксов. | BreadcrumbList |
| /course/queue-and-deque/ | Очередь и дек — AlgoDS | Дек хранит только ещё полезные элементы текущего окна и удаляет устаревшие индексы с противоположного конца. | BreadcrumbList |
| /course/same-direction-fast-slow/ | Указатели в одном направлении — AlgoDS | Новый элемент отличается от последнего записанного. | BreadcrumbList |
| /course/sequence-dp-lcs-edit/ | DP по двум последовательностям — AlgoDS | Для LCS и edit distance ячейка по двум префиксам выбирает переход, который точно соответствует цели: длине общей подпоследовательности или числу правок. | BreadcrumbList |
| /course/sorting-recursion-language-semantics/ | Сортировка, функции и рекурсия в двух языках — AlgoDS | Стандартной сортировке достаточно передать явный ключ порядка. | BreadcrumbList |
| /course/sorting-reveals-structure/ | Зачем сортировать перед решением — AlgoDS | Сортировка превращает поиск близкой пары среди всех пар в проверку соседей. | BreadcrumbList |
| /course/stack-and-brackets/ | Стек: незавершённая работа и скобки — AlgoDS | Стек хранит последнюю открытую конструкцию, которую должен закрыть следующий подходящий символ. | BreadcrumbList |
| /course/top-k-streams-k-way-merge/ | Top K, потоки и слияние источников — AlgoDS | При k-way merge куча хранит только текущую голову каждого источника, поэтому следующий глобальный минимум всегда находится на вершине. | BreadcrumbList |
| /course/topological-order/ | Зависимости и топологический порядок — AlgoDS | Алгоритм Кана удаляет только вершины без оставшихся зависимостей; неполный результат обнаруживает цикл. | BreadcrumbList |
| /course/tree-bfs-levels/ | BFS по уровням и выбор BFS/DFS — AlgoDS | Размер очереди в начале итерации фиксирует границу текущего уровня и не смешивает его с детьми. | BreadcrumbList |
| /course/tree-dfs-return-values/ | DFS дерева: что возвращает рекурсия — AlgoDS | Полезный рекурсивный вызов возвращает родителю краткое резюме поддерева, а не просто «обходит» его. | BreadcrumbList |
| /course/tree-model-and-traversals/ | Модель дерева и три порядка обхода — AlgoDS | Положение обработки корня относительно рекурсивных вызовов определяет preorder, inorder или postorder. | BreadcrumbList |
| /course/trie-prefix-index/ | Trie как индекс префиксов — AlgoDS | В trie путь от корня кодирует общий префикс, а terminal отделяет полное слово от просто существующего префикса. | BreadcrumbList |
| /course/variable-sliding-window/ | Скользящее окно (Sliding Window): C++ и Python — AlgoDS | Находим подстроку без повторов: поддерживаем инвариант окна, двигаем левую границу и разбираем ожидаемую сложность и ограничения метода. | BreadcrumbList |
| /course/xor-and-subset-masks/ | XOR и маски подмножеств — AlgoDS | XOR сокращает пары одинаковых чисел, а маска от 0 до 2^n-1 однозначно кодирует выбор каждого элемента небольшого набора. | BreadcrumbList |
| /leetcode-75/ | LeetCode 75: список задач и маршрут практики — AlgoDS | Официальный набор LeetCode 75 со ссылками на условия, связями с уроками AlgoDS и локальными статусами решений. Русскоязычный маршрут практики. | None |
| /practice/ | Практика алгоритмов: LeetCode, CodeRun и Codewars — AlgoDS | Каталог алгоритмических задач по этапам и режимам: работа с разбором, перенос паттерна и самостоятельное решение. Фильтры платформ и локальные статусы. | None |
| /reference/ | Справочник алгоритмов и структур данных: C++ и Python — AlgoDS | Сигналы задач, стоимость операций и границы применимости алгоритмов и структур данных. Краткие ориентиры со ссылками на уроки C++ и Python. | None |
| /reference/advanced-dynamic-programming/ | Продвинутое DP — справочник AlgoDS | Интервальное, битмасочное и древесное DP. Когда состояние естественно задаётся границами отрезка, подмножеством небольшого множества или ответом внутри поддерева. | BreadcrumbList |
| /reference/advanced-graph-algorithms/ | Продвинутые алгоритмы на графах — справочник AlgoDS | MST, Bellman–Ford, Floyd–Warshall, SCC, мосты и точки сочленения. Когда базовых BFS, DFS и Dijkstra недостаточно: нужны остов, отрицательные веса, пути между всеми парами или структура связности графа. | BreadcrumbList |
| /reference/advanced-string-search/ | Строковый поиск — справочник AlgoDS | KMP, Z-функция, rolling hash и Aho–Corasick. Для поиска образцов и повторов в длинном тексте, сравнения множества подстрок или одновременного поиска словаря шаблонов. | BreadcrumbList |
| /reference/algorithmic-mathematics/ | Алгоритмическая математика — справочник AlgoDS | НОД, модульная арифметика, решето и быстрое возведение в степень. Когда задача использует делимость, большие степени, вычисления по модулю или много запросов о простых числах. | BreadcrumbList |
| /reference/backtracking/ | Бэктрекинг — справочник AlgoDS | Перестановка выбирает следующий неиспользованный элемент; комбинация выбирает следующий индекс только справа, а подмножество допускает include/exclude. Нужно исследовать выборы, отменяя изменения состояния. | BreadcrumbList |
| /reference/binary-search/ | Бинарный поиск — справочник AlgoDS | Бинарный поиск безопасно отбрасывает половину только благодаря отсортированности и явно выбранным границам. Есть монотонный предикат или упорядоченная граница. | BreadcrumbList |
| /reference/bit-manipulation/ | Битовые операции — справочник AlgoDS | Маска с единственной единицей позволяет проверять конкретный бит, а операция x & (x - 1) удаляет младший установленный бит. Нужно работать с флагами, XOR или малым множеством. | BreadcrumbList |
| /reference/classic-sorting-algorithms/ | Классические сортировки — справочник AlgoDS | Bubble, selection, heap, counting, radix и их точные области применимости. Когда нужно выбрать сортировку под ограничения на память, стабильность и диапазон ключей, а не просто вызвать библиотечную функцию. | BreadcrumbList |
| /reference/disjoint-set/ | DSU — справочник AlgoDS | DSU хранит каждую компоненту как дерево представителей и быстро поддерживает только объединения. Связность меняется только объединениями. | BreadcrumbList |
| /reference/dynamic-array/ | Динамический массив — справочник AlgoDS | Стоимость операции следует из внутреннего устройства контейнера: плотного массива, хеш-таблицы или очереди. Нужны плотное хранение, быстрый доступ по индексу и рост в конце. | BreadcrumbList |
| /reference/dynamic-programming/ | Динамическое программирование — справочник AlgoDS | Мемоизация сохраняет точный ответ для каждой остаточной подзадачи и превращает повторяющееся дерево рекурсии в граф состояний. Подзадачи перекрываются, а ответ определяется малым состоянием. | BreadcrumbList |
| /reference/graph/ | Граф — справочник AlgoDS | Список смежности хранит только существующие рёбра и делает соседей вершины доступными за время, пропорциональное её степени. Сущности соединены произвольными отношениями или переходами. | BreadcrumbList |
| /reference/greedy/ | Жадный выбор — справочник AlgoDS | Жадный шаг допустим лишь тогда, когда его можно обменять на шаг из любого оптимального решения без ухудшения ответа. Локальный выбор можно доказуемо включить в оптимальное решение. | BreadcrumbList |
| /reference/hashing/ | Хеширование — справочник AlgoDS | `target-x` можно проверять среди уже просмотренных. Повторяется проверка наличия, частоты или соответствия. | BreadcrumbList |
| /reference/heap/ | Куча — справочник AlgoDS | Куча хранит частичный порядок: экстремум доступен сразу, но остальные элементы не обязаны быть полностью отсортированы. Нужно многократно получать текущий минимум или максимум. | BreadcrumbList |
| /reference/intervals/ | Интервалы — справочник AlgoDS | После сортировки по началу достаточно сравнивать новый интервал с последним уже объединённым. События имеют начало и конец, важны пересечения и порядок. | BreadcrumbList |
| /reference/lca-and-balanced-trees/ | LCA и сбалансированные деревья — справочник AlgoDS | Предки, AVL и красно-чёрные деревья на уровне корректных инвариантов. Для большого числа запросов о предках в статическом дереве или для словаря, где высота дерева поиска должна оставаться логарифмической после обновлений. | BreadcrumbList |
| /reference/linear-scan/ | Линейный обход — справочник AlgoDS | Несколько агрегатов обновляются одним чтением элемента. Ответ можно накопить за один проход. | BreadcrumbList |
| /reference/linked-list/ | Связный список — справочник AlgoDS | Dummy-узел убирает особый случай первой вставки, а хвост результата всегда указывает на последний уже слитый узел. Ответ строится изменением локальных ссылок. | BreadcrumbList |
| /reference/meet-in-the-middle/ | Meet in the middle — справочник AlgoDS | Разделение экспоненциального перебора на две половины с явной оценкой памяти. Когда полный перебор 2ⁿ уже невозможен, но n достаточно мало, чтобы перечислить примерно 2^(n/2) состояний каждой половины. | BreadcrumbList |
| /reference/monotonic-structure/ | Монотонная структура — справочник AlgoDS | Монотонный стек удаляет кандидата именно тогда, когда текущий элемент впервые становится для него ответом. Доминируемые кандидаты можно навсегда удалить. | BreadcrumbList |
| /reference/prefix-sum/ | Префиксная сумма — справочник AlgoDS | Сумма диапазона — разность двух префиксов. Нужны суммы или счётчики многих диапазонов. | BreadcrumbList |
| /reference/problem-solving/ | Разбор задачи — справочник AlgoDS | Строим корректный перебор, называем повторяющуюся работу и затем оптимизируем. Нужно связать ограничения, перебор и проверяемую идею. | BreadcrumbList |
| /reference/queue/ | Очередь — справочник AlgoDS | Дек хранит только ещё полезные элементы текущего окна и удаляет устаревшие индексы с противоположного конца. Состояния должны обрабатываться в порядке обнаружения. | BreadcrumbList |
| /reference/range-query-trees/ | Fenwick и дерево отрезков — справочник AlgoDS | Изменяемые префиксы и запросы на диапазоне. Когда массив меняется между запросами и пересчитывать префиксы или весь диапазон после каждого обновления слишком дорого. | BreadcrumbList |
| /reference/shortest-path/ | Кратчайший путь — справочник AlgoDS | Multi-source BFS кладёт все источники в нулевой слой до старта и одним обходом находит расстояние до ближайшего из них. Нужно минимизировать стоимость цепочки переходов. | BreadcrumbList |
| /reference/sliding-window/ | Скользящее окно — справочник AlgoDS | При повторе left прыгает за прошлое вхождение. Ответ относится к непрерывному фрагменту с ремонтируемым инвариантом. | BreadcrumbList |
| /reference/sorting/ | Сортировка — справочник AlgoDS | Сортировка превращает поиск близкой пары среди всех пар в проверку соседей. Порядок раскрывает соседство, группы или обменное доказательство. | BreadcrumbList |
| /reference/stack/ | Стек — справочник AlgoDS | Стек хранит последнюю открытую конструкцию, которую должен закрыть следующий подходящий символ. Нужно обработать последнюю незавершённую сущность. | BreadcrumbList |
| /reference/topological-sort/ | Топологическая сортировка — справочник AlgoDS | Алгоритм Кана удаляет только вершины без оставшихся зависимостей; неполный результат обнаруживает цикл. Нужно упорядочить зависимости в ориентированном ацикличном графе. | BreadcrumbList |
| /reference/tree/ | Дерево — справочник AlgoDS | Положение обработки корня относительно рекурсивных вызовов определяет preorder, inorder или postorder. Состояние естественно раскладывается по поддеревьям или уровням. | BreadcrumbList |
| /reference/trie/ | Trie — справочник AlgoDS | В trie путь от корня кодирует общий префикс, а terminal отделяет полное слово от просто существующего префикса. Много запросов разделяют строковые префиксы. | BreadcrumbList |
| /reference/two-pointers/ | Два указателя — справочник AlgoDS | Порядок позволяет безопасно убрать одну границу. Можно безопасно сдвигать одну из границ состояния. | BreadcrumbList |
| /roadmap/ | Roadmap алгоритмов и структур данных — AlgoDS | Карта 21 этапа AlgoDS: порядок изучения алгоритмов, зависимости между уроками и локальный прогресс от первых задач до подготовки к интервью. | None |
