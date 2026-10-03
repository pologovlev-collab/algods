# Этап 007 — Data-Driven Growth & Distribution

Дата: 2026-10-03, Europe/Moscow. **SAFE TO CREATE PR: YES** — инженерные проверки зелёные, scope ограничен. Это разрешение на review feature-ветки, не на merge/deploy или публикацию материала на внешней площадке. PR в этом этапе не создан.

Результат: восемь кластеров получили по одному редакционному primary URL; три существующих reference стали самостоятельными быстрыми ответами с кодом и переходом в курс; три lesson SEO titles уточнены. Новых публичных routes **0**. Главная часть deliverable — distribution и измерение, а не расширение сайта.

**Исключение из requested success criteria:** статья Хабра подготовлена полностью, но **не готова к прямой copy-paste публикации на Хабре**. Текущие правила площадки запрещают AI-written/edited тексты; useful links должны быть без меток. Нельзя честно объявить весь kit безусловно publish-ready. TG/VK готовы к copy-paste, восемь видео готовы как сценарии, а не как уже произведённые ролики.

## Git и границы

- Branch: `codex/algods-growth-007`.
- Base origin/main SHA: `4c613562b500c8f0bc69d14d2d2b3df9c22b5b6d`, merge PR #3 с 006; проверен свежим fetch.
- Стартовое дерево чистое. Ветка создана прямо от origin/main: локальный main не переключался и не обновлялся, согласно текущему запросу не трогать main. Команды switch main/pull из приложенного документа не выполнялись.
- Последовательно, без sub-agents; без PR/merge/deploy/изменения внешних кабинетов.
- Push трёх milestone commits в `origin/codex/algods-growth-007` успешен. Этот отчёт добавляется отдельным завершающим docs-коммитом и отправляется в ту же feature-ветку; итоговый SHA/совпадение remote проверяются при передаче результата.

| Commit | Содержание |
|---|---|
| d2528f1 | docs: map search demand to AlgoDS routes |
| 0c35a55 | feat: strengthen high-intent search entry pages |
| cf8e2da | docs: prepare organic distribution launch kit |
| Завершающий HEAD, `git log -1` | docs: record growth 007 verification and handoff — этот report; собственный SHA не встраивается в содержимое коммита |

## Baseline и final verification

| Проверка | До product edits | После product edits |
|---|---|---|
| npm run verify | PASS; 150 tests / 25 files | PASS; 151 tests / 26 files |
| Astro check / ESLint | 0 errors / PASS | 0 errors, 0 warnings, 0 hints / PASS |
| validate:content / examples | 54 урока / 21 этап; C++17 + Python | PASS, те же 54 / 21; существующие примеры исполнены |
| build | 97 content pages | 97 content pages |
| validate:links | 98 HTML включая служебный asset | PASS, тот же охват |
| validate:seo | Unique title/description/canonical, один H1; 91 BreadcrumbList | PASS, тот же инвентарь, canonical pathname без UTM |
| npm run test:e2e | 32 passed, 22.0 sec | 44 passed, 29.5 sec |
| npm run test:layout | 6 passed, 25.7 sec | 6 passed, 24.3 sec |
| git diff --check | PASS | PASS, в том числе весь diff от base |

`verify`/Chromium/компилятор запускались с разрешённой sandbox escalation; tooling/dependencies не менялись. Логи запуска локально в TEMP: `algods-007-baseline-verify.log`, `algods-007-baseline-e2e.log`, `algods-007-baseline-layout.log`, `algods-007-final-verify.log`, `algods-007-final-e2e.log`, `algods-007-final-layout.log`. Это локальные результаты, не remote CI или production verification.

Новый executable-code test сначала падал из-за отсутствия quickAnswer, затем прошёл. Проверены обе реализации lower bound против bisect_left/std::lower_bound; пары — против перебора всех разных индексов; окна — против пересчёта каждой суммы. Малые входы длины 0…5 включают повторы, отрицательные значения, target вне диапазона, k < 1 / k > n. Дополнительно C++ sums > INT_MAX. Не утверждаем доказательство всех возможных входов: предусловия и инварианты описаны рядом с кодом.

В промежуточных прогонах исправлены: неверный импорт нового теста, type guard первого next-step link, старое ожидаемое широкое SEO title в e2e/seo.spec.ts. Остальные assertions про pedagogical H1/summary/description сохранены. После исправлений полные прогоны зелёные.

Browser QA: новые `e2e/growth.spec.ts` проверяют три priority reference на 360/390/430/768/1024/1440 в light/dark: HTTP 200, один H1, крошки, first-two-viewports navigation, переход к коду, смену Python/C++, отсутствие body overflow/geometry issues/console errors, clean canonical при UTM. Существующие E2E проверяют остальные критические flows и guides; release layout проходит по всем reference и ключевым routes, включая `/`, `/course/`, `/reference/`, `/big-o/`, `/algorithm-patterns/`, `/coding-interview/`, `/leetcode-75/`, `/about/`.

Просмотрены реальные screenshots: binary search mobile intro, sliding window mobile Python, two pointers desktop dark intro. Код читается, локальные ссылки ведут к нужной секции, screenshot не показывает body overflow. Все три distribution PNG просмотрены после browser export. Это representative visual review, не заявление полного accessibility compliance. Wide code/table сохраняют локальный scroll; архитектура reduced motion не менялась.

## Query → URL summary

Полная таблица intent/secondary/evidence/gap/action: [query-map.md](query-map.md). Аудит архитектуры и источников: [audit.md](audit.md).

| Cluster | Primary URL | Priority и решение |
|---|---|---|
| Алгоритмы и структуры данных | /course/ | Broad learning intent; главная = бренд, reference = lookup |
| Бинарный поиск | /reference/binary-search/ | HIGH, усилили быстрый ответ |
| Два указателя | /reference/two-pointers/ | HIGH, усилили быстрый ответ |
| Скользящее окно алгоритм | /reference/sliding-window/ | MEDIUM/HIGH только algorithmic intent, усилили |
| Сложность алгоритмов / Big O | /big-o/ | Готовый чистый intent, без raw volume chasing |
| LeetCode 75 | /leetcode-75/ | Небольшой, конкретный intent; сохранить |
| Алгоритмы для собеседования | /coding-interview/ | Готовый маршрут, distribution landing |
| Паттерны алгоритмов | /algorithm-patterns/ | Готовая памятка выбора, distribution landing |

## Wordstat: факты и noisy data

Период 01–30.09.2026; все регионы, desktop/smartphone/tablet; числа из предоставленной расшифровки скриншотов, live Wordstat account не открывался.

- «Алгоритмы и структуры данных» 5 957; «алгоритмы программирования и структуры данных» 1 178. «1 алгоритм…» 831, «читать» 567, «структуры и алгоритмы обработки данных» 346, «языки» 249 имеют неоднозначность intent; отдельные routes не созданы.
- «Бинарный поиск» 4 523; «метод бинарного поиска» 712; «код» 668; «алгоритм» 594; массив 393, элементы 279, сортировка 262. «Бинарное дерево поиска» 480 = отдельная структура, не keyword для binary search landing.
- «Два указателя» 2 051; «метод» 214; «алгоритм» 118; c 99; python 71; задачи 67; массив 45; метод/python 45. Не складывать пересекающиеся формулировки.
- «Скользящее окно» 1 490 смешивает intents. Algorithmic evidence: «алгоритм» 111, «метод» 107, python 23. «Скользящее среднее окно» 70 и TCP 33 не приписаны алгоритмическому кластеру.
- LeetCode 75 69; Blind 75 LeetCode 25 — другой список, не суммировать с официальным LeetCode 75.
- Big O 7 470 **не используется как алгоритмический спрос**: big o clock 2 087, big s o 1 284, big o live 624, big o c 573, little big o 538. Частотности чистых complexity queries неизвестны.
- Для interview/pattern clusters чисел не предоставлено: не придуманы.

Wordstat = встречаемость, Webmaster/GSC = реальные показы AlgoDS, Метрика = посещения. Реальная доступная AlgoDS доля спроса неизвестна. Ни 4 523, ни другие значения не названы потенциальными посетителями сайта.

## Существующие URLs improved; metadata before → after

### Reference metadata

| URL | Title before | Title after |
|---|---|---|
| /reference/binary-search/ | Бинарный поиск — справочник AlgoDS | Бинарный поиск: алгоритм, O(log n), код C++ и Python — AlgoDS |
| /reference/two-pointers/ | Два указателя — справочник AlgoDS | Два указателя: метод, примеры C++ и Python — AlgoDS |
| /reference/sliding-window/ | Скользящее окно — справочник AlgoDS | Скользящее окно: алгоритм, код C++ и Python — AlgoDS |

| URL | Description before | Description after |
|---|---|---|
| /reference/binary-search/ | Бинарный поиск безопасно отбрасывает половину только благодаря отсортированности и явно выбранным границам. Есть монотонный предикат или упорядоченная граница. | Бинарный поиск в отсортированном массиве: как сужать диапазон, почему O(log n), lower bound и повторы. Короткий код C++17 и Python 3, ошибки и уроки. |
| /reference/two-pointers/ | Порядок позволяет безопасно убрать одну границу. Можно безопасно сдвигать одну из границ состояния. | Метод двух указателей: поиск пары в отсортированном массиве, безопасный сдвиг границ, O(n), направления движения и ограничения. Код C++17 и Python 3. |
| /reference/sliding-window/ | При повторе left прыгает за прошлое вхождение. Ответ относится к непрерывному фрагменту с ремонтируемым инвариантом. | Скользящее окно (Sliding Window) для массивов и строк: фиксированная длина, обновление суммы, переменное окно и ограничения. Код C++17 и Python 3. |

Каждый reference теперь имеет определение, локальную навигацию к коду/условиям/уроку, короткую трассу, два проверяемых примера, complexity assumptions и tests. Не скопирован целиком урок. Данные отделены от Astro template в `reference-quick-answers.ts`; общий optional schema/render работает для всех трёх. Используются существующие syntax highlighting, language toggle и copy controls; новый client JS не добавлен.

### Уточнения lesson title

| URL | Title before | Title after | Description |
|---|---|---|---|
| /course/binary-search-invariant/ | Бинарный поиск: инвариант, C++ и Python — AlgoDS | Точный бинарный поиск: инвариант закрытых границ — AlgoDS | Без изменения: точный поиск, закрытый диапазон, midpoint, крайние случаи |
| /course/opposite-two-pointers/ | Два указателя (Two Pointers): C++ и Python — AlgoDS | Поиск пары в отсортированном массиве: два указателя — AlgoDS | Без изменения: перебор, доказательство сдвига, complexity, edge cases |
| /course/variable-sliding-window/ | Скользящее окно (Sliding Window): C++ и Python — AlgoDS | Подстрока без повторов: инвариант переменного окна — AlgoDS | Без изменения: уникальная подстрока, состояние окна, ожидаемая сложность |

Педагогические H1, summaries и body уроков сохранены. Метаданные остальных guides уже полезны; их не переписывали ради keywords.

## Internal linking и cannibalization

Ссылки на первые полные уроки вынесены в первый экран reference; далее binary search ведёт к boundaries/on-answer, two pointers — к sliding-window, window — к fixed/variable lessons; все три — к /practice/. Existing pattern-guide links, prerequisites, крошки и course sidebar сохранены. Главная/course/reference/guide роли различены, footer не расширен.

У каждого из восьми кластеров один редакционный primary. Узкие уроки остаются поддержкой с собственной ценностью и canonical. Не ставились межстраничные canonical, redirect или noindex для разных учебных материалов. `/binary-search/`, `/two-pointers/`, `/sliding-window/` не созданы.

**Предел утверждения:** одинаковый редакционный targeting устранён; отсутствие реальной search cannibalization пока не доказано, поскольку query × URL dataset недостаточен. 008 проверит фактическое распределение показов/кликов. Ни позиция около 7.58 на 17 показах, ни 2 сек search visits не использованы как уверенная оценка UX/эффективности 006.

## Distribution kit и готовность

| Материал | Что подготовлено | Как использовать |
|---|---|---|
| Habr | 5 title, 3 lead, final title/body, constraints/brute force/bottleneck и 7 групп техник, CTA/disclosure, 3 точных image placements | Полный черновик; самостоятельный авторский текст нужен из-за правил Хабра |
| Telegram / VK | 8 angles × 2 готовых версии = 16 текстов, target, встроенная UTM, image suggestion, venue/anti-spam notes | Copy-paste блока выбранной площадки; картинки необязательны |
| Shorts / Seedance | 8 сценариев 30–35 сек, 9:16: hook, voiceover, shot timings, overlays, CTA, target, 3 platform URLs, YouTube title/description, VK/TG captions, prompt/negative guidance | Снять/смонтировать; generated visual только там, где не нужна точная механика |
| Illustrations | 3 авторские SVG + 3 PNG 1200×630, визуально проверены | Готовые upload assets, не temp screenshots |
| UTM | 41 distinct planned URLs: 16 post + 24 video social links, 1 Habr HOLD | 40 social готовы; Habr clean URL и referrer вместо UTM |

Полные материалы: [launch-kit/README.md](launch-kit/README.md), [статья](launch-kit/habr-article.md), [TG/VK](launch-kit/telegram-vk.md), [видео](launch-kit/shorts-seedance.md), [таблица UTM](utm-plan.md). Все 41 targets проверены на build route. Critical text/code/цифры — overlay при монтаже; existing labs лучше screen recording. Seedance access/version/API не проверены; генерация/публикация видео не выполнялась.

Правила Хабра: [официальный источник](https://habr.com/ru/docs/help/rules/), проверка 03.10.2026. В generated body уже clean CTA URL, Habr UTM вынесена отдельно и запрещена для копирования в статью. Disclosure не является разрешением на self-promo или AI-generated текст. Это существенное ограничение, не скрытое «готово».

## Manual setup и measurement handoff

[manual-actions.md](manual-actions.md) содержит:

- GSC: открыть Search Console, domain property `algods.ru`, реальный TXT от Google в DNS, alternative URL-prefix при отсутствии DNS, отправка `https://algods.ru/sitemap-index.xml`, inspect/index checklist. **Статус: manual setup required**; token не добавлен и наличие работающего GSC не заявлено.
- Webmaster: sitemap/indexing/revisit, проверка привязки 108312356, подтверждение запроса, обход по счётчику по официальной инструкции, 10 конкретных URLs. Переобход изменённых страниц — после фактического deploy, не feature push.
- GitHub: About → gear, website `https://algods.ru`, 3 description options + recommended, 8 recommended topics; competitive-programming рассмотрен и пока не рекомендован. Внешние настройки не изменены.

[measurement.md](measurement.md): screenshot baseline, weekly dashboard со всеми требуемыми колонками, журнал публикаций, UTM channel performance, impressions → clicks → landing → deeper page → course/practice proxy → return. Локальный прогресс не выдаётся за доступную analytics event. Custom goals/new analytics не добавлены.

[data-template.md](data-template.md): CSV для Webmaster/GSC/Метрики, query/page pairing при доступности и явное N/A при недоступности, одинаковые даты/filters, публикационный журнал. Раздельные aggregates не соединяются в выдуманные query→landing pairs; ETL не строился.

Baseline: 21 visitors, 32 visits, 46 views, 3 search visitors; Webmaster 17 impressions/1 click. Период Метрики неизвестен, поэтому не назван weekly. Post-006 attribution неизвестна. Следующий checkpoint: T+14…28 дней после первой публикации; если старт 03.10.2026 — 17.10–31.10.2026. Цель 1000 visitors/week долгосрочная, не promised outcome 007.

## Changed files

27 файлов после добавления report; продукт и проверки — 10, документы/kit/assets — 17. Точный список:

```text
docs/growth-007/audit.md
docs/growth-007/query-map.md
docs/growth-007/data-template.md
docs/growth-007/manual-actions.md
docs/growth-007/measurement.md
docs/growth-007/utm-plan.md
docs/growth-007/report.md
docs/growth-007/launch-kit/README.md
docs/growth-007/launch-kit/habr-article.md
docs/growth-007/launch-kit/telegram-vk.md
docs/growth-007/launch-kit/shorts-seedance.md
docs/growth-007/launch-kit/assets/complexity-work.svg
docs/growth-007/launch-kit/assets/complexity-work.png
docs/growth-007/launch-kit/assets/two-pointer-trace.svg
docs/growth-007/launch-kit/assets/two-pointer-trace.png
docs/growth-007/launch-kit/assets/pattern-signals.svg
docs/growth-007/launch-kit/assets/pattern-signals.png
src/data/reference-quick-answers.ts
src/lib/reference.ts
src/components/ReferenceTopic.astro
src/pages/reference/[slug].astro
src/content/lessons/stage-03/s03-l01-opposite-two-pointers.md
src/content/lessons/stage-04/s04-l02-variable-sliding-window.md
src/content/lessons/stage-08/s08-l01-binary-search-invariant.md
tests/reference-quick-answers.test.ts
e2e/growth.spec.ts
e2e/seo.spec.ts
```

## Intentionally unchanged и риски

Metrica ID/code, public/sw.js, .github/deploy, CNAME/domain/canonical architecture, progress IDs/schema, stage/lesson order/prerequisites, Practice corpus, LeetCode identities, CodeRun/Codewars mappings, lab logic, dark-theme architecture, dependencies/lockfile, backend отсутствует. В diff от base нет изменений этих областей. Local AI files/prompt archives/memory/reference screenshots не staged/committed. Три marketing illustrations — намеренные kit assets, не временные AI artifacts.

Риски: search target — гипотеза до данных; поисковик может выбрать support lesson; объём спроса не гарантирует impressions/visits; малый baseline и неизвестный период ограничивают сравнение; UTM может теряться, blockers и разные devices влияют на Метрику; clickability Shorts зависит от интерфейса; Хабр требует авторской работы; изменения reference ещё не в production до отдельного merge/deploy. Remote CI, production QA, indexing/ranking/traffic и acceptance площадок в этом этапе не подтверждены.

Инженерно ветка готова для review. Для распространения начинать с разрешённых TG/VK материалов; сохранить дату поста и первый channel export. В 008 принимать решения по реальным query/page и landing/channel данным, а не продолжать разработку без нового свидетельства.
