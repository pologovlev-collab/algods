# Данные для 008 через 2–4 недели

Прислать CSV UTF-8 + короткую заметку: timezone, dates, filters, дата deploy 007, даты/URL публикаций, изменения настроек аналитики. Одинаковые завершённые интервалы для сравнений; минимум один post-launch и, если доступен, сопоставимый previous период. Скриншоты не заменяют CSV с полными строками. Empty / N/A = unavailable, не ноль.

## Yandex Webmaster

**Поисковые запросы → Статистика запросов / Аналитика запросов**: период, все устройства/регионы либо явно зафиксированный фильтр → выгрузка. Нужные поля:

```csv
Query,Impressions,Clicks,CTR,Average position,Landing page
```

Если UI выгружает запросы и страницы отдельно, прислать оба файла. Для трёх priority кластеров дополнительно выгрузить доступную детализацию запрос → URL. Не соединять независимые aggregate tables, приписывая каждому запросу произвольный landing. Если pair dimension недоступна, прямо написать; cannibalization остаётся не доказанной.

## Google Search Console

**Эффективность → Результаты поиска**, Search type Web, одинаковые dates. Export Queries и Pages; для priority query применить фильтр запроса и экспортировать Pages. Для primary URL — фильтр страницы и экспорт Queries. Стандартный export не всегда содержит совместную query/page детализацию; не выдавать две таблицы за пары.

```csv
Query,Page,Clicks,Impressions,CTR,Position
```

Также приложить статус Sitemap и Pages indexing (indexed/not indexed + reasons). Если GSC не подключён или данных нет, сообщить это вместо придуманных значений.

## Метрика 108312356

**Содержание → Страницы входа**, **Источники → Источники, сводка**, **Источники → Метки UTM**. Выгрузить доступные отчёты CSV с same dates; campaign filter отдельно для launch.

```csv
Landing page,Users,Visits,Bounce,Time,Depth,Source/medium
```

Дополнительно для distribution: source, medium, campaign, content, visits, users, pageviews. Time указать в секундах либо описать формат. Bounce/CTR явно пометить как процент или fraction. Не экспортировать персональные данные/Webvisor записи.

## Журнал публикаций

```csv
Published at MSK,Platform,Account,Material slug,Post URL,Target URL,UTM URL,Notes
```

В notes: image/video/text, повторная публикация, ограничения ссылок, известный outage или смена filters. Первичный разбор в 008 ручной; ETL сейчас не строим.
