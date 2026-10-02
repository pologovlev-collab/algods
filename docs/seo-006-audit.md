# Organic growth and SEO foundation

## Scope and baseline

Work starts from `origin/main` at `b95da25`, whose tracked files match the previous
`hotfix/metrica-cache-cleanup` checkout. Local `main` is not switched to or updated.
The feature branch is `codex/algods-seo-006`. Deployment is out of scope.

The repository uses Astro static generation, 54 JSON-frontmatter Markdown lessons,
21 ordered stages, reusable reference data, and browser-local progress. The shared
layout already provides descriptions, canonical URLs, OpenGraph and Twitter tags.
The sitemap integration and robots file point to `https://algods.ru`.

Inspection of the existing output finds 93 content HTML pages, each with a unique
title and description, one canonical and one H1. No content page has noindex.
There is no JSON-LD or BreadcrumbList. The Yandex verification HTML is a machine
verification asset, not a content page, and must be excluded from content SEO checks.
The fresh production baseline is checked again after the baseline build.

## Search intent gaps

- Course, roadmap, practice and LeetCode titles are too general to describe their
  actual purpose when viewed outside the site.
- Lesson H1s are useful teaching labels, but some omit familiar technique names.
  Keep these H1s and summaries; introduce optional search metadata with fallbacks.
- There is no standalone complexity overview, pattern decision guide, or explanation
  of how to use the existing curriculum for interview preparation.
- The reference has strong underlying signals and topic mappings. Reuse those
  sources for guide navigation; do not introduce a competing curriculum.
- Footer discovery is limited to the reference. Add a restrained navigation list
  and contextual links, without expanding the header.

## Implementation sequence

1. Add optional lesson SEO fields, a tested metadata resolver, safe JSON-LD
   serialization and visible reusable breadcrumbs for lessons and reference topics.
   Curate ten titles only after reading the matching content. Verify and commit.
2. Add exactly three search guides (`/big-o/`, `/algorithm-patterns/`,
   `/coding-interview/`) and a separate trust page (`/about/`). Use static content,
   current typography/color tokens, local scrolling for wide tables, real lesson
   mappings and all 21 stages in their existing order. Verify and commit.
3. Improve section metadata and discoverability, add generated-HTML SEO validation
   after build in verify, and add browser coverage for navigation, metadata,
   breadcrumbs, local table scrolling, six viewport widths and dark mode.
   Run final gates, inspect the complete diff, commit and push only the feature branch.

## Invariants

Preserve lesson URLs/IDs/H1s/summaries, prerequisite graph and order, progress schema
and IDs, practice corpus/provider mappings, labs, Search behavior, theme architecture,
Metrica 108312356, service-worker cleanup, Pages workflow, robots, CNAME and social assets.
No dependency upgrades, backend, author biography, ratings, FAQ markup or invented dates.
Only BreadcrumbList is needed: its entries must match visible navigation, use absolute
canonical-domain URLs and serialize safely inside a script element.

## Verification record

Initial sandbox verify failed because Astro attempted a telemetry config write outside
the workspace. With telemetry disabled, check/lint succeeded but an existing executable
reference test hit `spawnSync python EPERM`. Repeat full gates with the execution
permission needed by the existing C++/Python/browser toolchain; these are environment
failures, not product regressions.

Results and final metadata inventory are recorded in `seo-006-report.md` after final QA.

Baseline completed successfully: 105 checked files / no diagnostics, 22 unit suites /
133 tests, 54 lessons across 21 stages, 53 C++17 and 53 Python examples executed,
93 generated content pages, 94 HTML files validated (including the verification asset),
15/15 Chromium E2E tests and 6/6 release layout audits (360, 390, 430, 768, 1024, 1440).
`git diff --check` passed. Fresh build confirms the metadata audit above.

## Source checks

Technical explanations are checked against the existing lesson implementations and
primary teaching/library sources. The new material is an original overview with
links to deeper lessons, not copied source text.

- [MIT 6.006: asymptotic complexity](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/c6d8f06c6f11e3342633dec85498f551_MIT6_006S20_r01.pdf)
- [MIT 6.006: course materials, graph search and dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)
- [Python heapq](https://docs.python.org/3/library/heapq.html)
- [Python data structures](https://docs.python.org/3/tutorial/datastructures.html)
- [Google BreadcrumbList guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
