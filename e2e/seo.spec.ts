import { expect, test } from '@playwright/test';
import { inspectLayout } from './helpers/layout';
import { THEME_STORAGE_KEY } from '../src/lib/theme';

for (const width of [360, 390, 430, 768, 1024, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`guides preserve layout, theme and console at ${width}px in ${theme}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
      for (const route of ['/big-o/', '/algorithm-patterns/', '/coding-interview/', '/about/']) {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        expect((await page.evaluate(inspectLayout)).issues, route).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        const footerBounds = await page.locator('footer a').evaluateAll((links) => links.map((link) => {
          const rect = link.getBoundingClientRect();
          return { left: rect.left, right: rect.right, viewport: window.innerWidth };
        }));
        expect(footerBounds.every(({ left, right, viewport }) => left >= -1 && right <= viewport + 1)).toBe(true);
        if (width === 390 || width === 1440) {
          await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '')}-viewport.png`) });
        }
      }
      if (width <= 430) {
        await page.goto('/big-o/');
        const table = page.getByRole('region', { name: 'Прокручиваемая таблица' }).first();
        expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
        await table.scrollIntoViewIfNeeded();
        await expect(table).toBeInViewport();
        await table.focus();
        await expect(table).toBeFocused();
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
        if (width === 390) await table.screenshot({ path: testInfo.outputPath('big-o-table-keyboard.png') });
      }
      expect(errors).toEqual([]);
    });
  }
}

test('learning guides render standalone content and reuse the real curriculum', async ({ page }, testInfo) => {
  for (const route of ['/big-o/', '/algorithm-patterns/', '/coding-interview/', '/about/']) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://algods.ru${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.getByRole('navigation', { name: 'Хлебные крошки' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '')}-desktop.png`), fullPage: true });
  }
  await page.goto('/big-o/');
  await expect(page.getByRole('table')).toHaveCount(3);
  await page.goto('/algorithm-patterns/');
  await expect(page.locator('[data-pattern-guide]')).toHaveCount(12);
  await page.goto('/coding-interview/');
  await expect(page.locator('[data-interview-stage]')).toHaveCount(21);
  expect(await page.locator('[data-interview-stage]').evaluateAll((items) => items.map((item) => item.getAttribute('data-interview-stage'))))
    .toEqual(Array.from({ length: 21 }, (_, i) => String(i)));
});

test('lesson SEO overrides keep the teaching H1 and summary', async ({ page }) => {
  await page.goto('/course/variable-sliding-window/');
  await expect(page).toHaveTitle('Подстрока без повторов: инвариант переменного окна — AlgoDS');
  await expect(page.locator('h1')).toHaveText('Расширение, сжатие и инвариант окна');
  await expect(page.locator('.lesson-title > p').last()).toHaveText('При повторе left прыгает за прошлое вхождение.');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /подстроку без повторов/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
});

test('unmodified lesson metadata still falls back to its title and summary', async ({ page }) => {
  await page.goto('/course/complexity-and-brute-force/');
  await expect(page).toHaveTitle('От полного перебора к узкому месту — AlgoDS');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Строим корректный перебор, называем повторяющуюся работу и затем оптимизируем.');
});

test('visible course and reference breadcrumbs match their structured trail', async ({ page }) => {
  for (const route of ['/course/binary-search-boundaries/', '/reference/binary-search/']) {
    await page.goto(route);
    const nav = page.getByRole('navigation', { name: 'Хлебные крошки' });
    await expect(nav.locator('[aria-current="page"]')).toHaveText(await page.locator('h1').innerText());
    const trail = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(trail['@type']).toBe('BreadcrumbList');
    expect(trail.itemListElement.map((item: { name: string }) => item.name))
      .toEqual(await nav.locator('li').allTextContents().then((items) => items.map((text) => text.replace(/^\s*\/\s*/, '').trim())));
    expect(trail.itemListElement.at(-1).item).toBe(`https://algods.ru${route}`);
    const parent = nav.getByRole('link').nth(1);
    await parent.click();
    await expect(page).toHaveURL(route.startsWith('/course/') ? '/course/' : '/reference/');
  }
});

test('guides have contextual incoming links and footer discovery without expanding the header', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Материалы AlgoDS' });
  for (const route of ['/big-o/', '/algorithm-patterns/', '/coding-interview/', '/about/']) {
    await expect(footer.locator(`a[href="${route}"]`)).toHaveCount(1);
  }
  await footer.getByRole('link', { name: 'Big O и сложность' }).click();
  await expect(page).toHaveURL('/big-o/');
  await page.getByRole('link', { name: 'оценки бюджета по ограничениям' }).click();
  await expect(page).toHaveURL('/course/constraints-and-budgets/');
  await page.locator('.lesson-context-links a[href="/big-o/"]').click();
  await expect(page).toHaveURL('/big-o/');
  for (const route of ['/course/', '/roadmap/', '/leetcode-75/', '/practice/']) {
    await page.goto(route);
    await expect(page.locator('main a[href="/coding-interview/"]')).toHaveCount(1);
  }
  await page.goto('/reference/');
  await expect(page.locator('main a[href="/big-o/"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/algorithm-patterns/"]')).toHaveCount(1);
  await page.goto('/reference/sliding-window/');
  await page.locator('main a[href="/algorithm-patterns/#sliding-window"]').click();
  await expect(page).toHaveURL('/algorithm-patterns/#sliding-window');
});
