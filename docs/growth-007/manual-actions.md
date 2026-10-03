# Ручные действия после 007

Внешние настройки в этом этапе не изменены. Сначала PR/review и отдельное решение владельца о merge/deploy, затем переобход изменённых страниц. Публикации с существующими URL можно запускать раньше, но они тогда ведут на 006.

## Google Search Console — manual setup required

1. Откройте [Search Console](https://search.google.com/search-console/), войдите в свой Google account. Меню выбора ресурса слева сверху → **Добавить ресурс**.
2. Рекомендуемый тип: **Доменный ресурс**, значение `algods.ru` без https и путей. Он охватит все протоколы/поддомены. Нужен доступ к DNS домена.
3. Нажмите продолжить и скопируйте **реальный TXT**, который покажет Google. Никакого verification token из этого документа нет.
4. Откройте DNS-зону algods.ru у провайдера DNS (может отличаться от регистратора). Добавить запись → тип TXT, host/name `@` (либо пустой host, если так требует панель), value = весь TXT от Google. Сохранить. Не удалять A/AAAA/CNAME/MX или другие TXT. TTL оставить стандартный.
5. Вернитесь в GSC → **Подтвердить**. Если ещё не найдено, дождитесь распространения DNS и повторите. TXT сохраните после подтверждения.
6. Если DNS недоступен: тип **Префикс URL**, `https://algods.ru/`. Используйте предложенный Google HTML-файл или meta-тег только с реальным значением и отдельной согласованной правкой; в 007 файл/токен не добавлен. Этот тип не охватывает автоматически www/http.
7. Выберите ресурс → **Файлы Sitemap**. Для доменного ресурса отправьте `https://algods.ru/sitemap-index.xml`; при UI с фиксированным префиксом достаточно `sitemap-index.xml`. Дождитесь статуса обработки и проверьте ошибки.
8. Верхняя строка **Проверка URL** → вставить один из URL ниже → проверить индексируемость и canonical. При необходимости **Проверить опубликованный URL**, затем **Запросить индексирование**. Запрос не гарантирует индексирование/позиции; не повторять ежедневно.
9. Через 2–4 недели: **Эффективность → Результаты поиска**, выбрать одинаковый период, проверить Queries и Pages, экспортировать. Пока не подключено/нет данных, писать N/A, не 0.

Справка: [подтверждение](https://support.google.com/webmasters/answer/9008080?hl=ru), [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en), [Sitemaps](https://support.google.com/webmasters/answer/10351509?hl=en).

## Yandex Webmaster и Метрика 108312356

1. [Вебмастер](https://webmaster.yandex.ru/) → выбрать подтверждённый `https://algods.ru`. **Индексирование → Файлы Sitemap** → убедиться, что `https://algods.ru/sitemap-index.xml` добавлен и читается без ошибок. Добавить, если отсутствует.
2. **Индексирование → Страницы в поиске** и **Проверка статуса URL**: проверить приоритетные адреса ниже; отдельно исключённые/ошибки обхода. Отсутствие в поиске не равно технической ошибке сайта.
3. **Настройки → Привязка к Яндекс Метрике**: проверить `108312356`. Если привязки нет, в [Метрике](https://metrika.yandex.ru/) выбрать этот счётчик → **Настройка → Счётчик → Привязка к Вебмастеру**, отправить запрос на подтверждённый сайт. Вернуться в Вебмастер и подтвердить запрос в настройках привязки. Нужны права на оба ресурса. Если названия пунктов UI отличаются, следовать [официальной пошаговой инструкции](https://yandex.ru/support/metrica/ru/general/link-webmaster).
4. **Индексирование → Обход по счётчикам** → включить обход для 108312356, если опция доступна и ещё выключена. **Примеры страниц** — проверить получаемые URL. Этот механизм помогает discovery, но не обещает включение в поиск.
5. **Индексирование → Переобход страниц** → вставить адреса ниже, по одному на строку; отправить после фактического deploy. Никаких запросов переобхода feature preview URL.
6. В Метрике **Отчёты → Источники → Метки UTM**: выбрать кампанию `algods_launch_2026_10`, смотреть source/medium/content. **Содержание → Страницы входа**: смотреть URL priority landing и более глубокие просмотры. JavaScript goals не требуется.

## 10 адресов для проверки GSC / переобхода Яндекса

```text
https://algods.ru/
https://algods.ru/course/
https://algods.ru/reference/binary-search/
https://algods.ru/reference/two-pointers/
https://algods.ru/reference/sliding-window/
https://algods.ru/big-o/
https://algods.ru/algorithm-patterns/
https://algods.ru/coding-interview/
https://algods.ru/leetcode-75/
https://algods.ru/about/
```

Если первоочередной запрос индексирования ограничен quota — сначала три reference, затем course и guides. Справочный каталог `https://algods.ru/reference/` проверить дополнительно; он уже существовал до 007.

## GitHub discovery

Откройте [репозиторий](https://github.com/pologovlev-collab/algods). Справа **About → шестерёнка** (Edit repository metadata). Website = `https://algods.ru`.

Description, recommended:
```text
Free Russian-language algorithms course with C++17 and Python 3 examples, interactive labs, practice, and local progress. No account required.
```

Ещё два варианта:
```text
Learn algorithmic thinking in Russian: 54 lessons, C++17 and Python 3, a dependency roadmap, and LeetCode 75 practice.
```
```text
Open-source algorithms and data structures course in Russian, from brute force to invariants and interview problem solving.
```

Topics, recommended (ввести по одному, затем **Save changes**):
```text
algorithms
data-structures
dsa
cpp
python
leetcode
coding-interviews
education
```

`competitive-programming` допустим как вторичный topic, но пока не рекомендован: продукт сосредоточен на reasoning/interview, не на соревнованиях. Topics описывают учебный контент; они не утверждают, что сам frontend написан на C++/Python. Текущие значения внешнего About не менялись и live-аудит настроек не проводился. [Официальная инструкция GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).

## Публикации — минимум ручной работы

Откройте `launch-kit/telegram-vk.md`, копируйте только блок выбранной площадки с уже встроенной ссылкой. Картинка необязательна. Для видео: озвучка + screen recording/иллюстрации + overlay, затем готовые title/description/caption из `shorts-seedance.md`. Никаких массовых рассылок или внешних действий от агента.

Хабр: файл `habr-article.md` — **авторский черновик для дальнейшей работы, не разрешённый copy-paste**. Правила запрещают AI-written/edited текст и полезные ссылки с метками. Для немедленного распространения использовать готовые TG/VK публикации; не пытаться обойти ограничение перефразированием нейросетью. Авторская статья на Хабре требует самостоятельного авторского текста и соблюдения правил площадки.
