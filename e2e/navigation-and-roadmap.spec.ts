import { expect, test } from '@playwright/test';

test('global search ranks canonical heap pages and supports keyboard navigation @smoke', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-global-search] summary').click();
  const input = page.locator('[data-global-search-input]');
  const results = page.locator('[data-global-search-results] a');

  await input.fill('Moving Zeros To The End');
  await expect(results.filter({ hasText: 'Moving Zeros To The End' }).first()).toHaveAttribute(
    'href',
    'https://www.codewars.com/kata/52597aa56021e91c93000cb0',
  );

  await input.fill('heap');
  await expect(results.nth(0)).toHaveAttribute('href', '/reference/heap/');
  await expect(results.nth(1)).toHaveAttribute('href', '/course/heap-priority-queue-model/');

  await input.press('ArrowDown');
  await expect(results.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(results.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/course\/heap-priority-queue-model\/$/);
});

test('roadmap stage details expose exact prerequisites and open a canonical lesson', async ({ page }) => {
  await page.goto('/roadmap/');
  await page.locator('.learning-landscape__desktop button[data-map-stage-id="13"]').click();

  const panel = page.locator('[data-map-stage-panel="13"]');
  const prerequisites = panel.locator('.learning-landscape__relations div').first().locator('dd');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Графы и сетки', exact: true })).toBeVisible();
  await expect(prerequisites).toContainText('01 · Инструменты языка');
  await expect(prerequisites).toContainText('02 · Массивы, строки и хеширование');
  await expect(prerequisites).toContainText('10 · Деревья');
  await expect(prerequisites).toContainText('11 · Куча и приоритетная очередь');

  await panel.getByRole('link', { name: /Графы, списки смежности и сетки/ }).click();
  await expect(page).toHaveURL(/\/course\/graph-representation-and-grids\/$/);
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('menu, search escape, and critical pages remain usable without body overflow @smoke', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('.mobile-menu');
    await menu.locator('summary').click();
    await expect(menu).toHaveAttribute('open', '');
    await menu.getByRole('link', { name: 'Практика', exact: true }).click();
    await expect(page).toHaveURL(/\/practice\/$/);

    const search = page.locator('[data-global-search]');
    const searchSummary = search.locator('summary');
    await searchSummary.click();
    const input = search.locator('[data-global-search-input]');
    await expect(input).toBeFocused();
    await input.press('Escape');
    await expect(search).not.toHaveAttribute('open', '');
    await expect(searchSummary).toBeFocused();

    for (const path of [
      '/',
      '/roadmap/',
      '/practice/',
      '/course/opposite-two-pointers/',
      '/course/dp-tabulation-and-order/',
    ]) {
      await page.goto(path);
      const hasPageOverflow = await page.evaluate(async () => {
        const initialY = window.scrollY;
        window.scrollTo(document.documentElement.scrollWidth, initialY);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const rootCanScroll = window.scrollX > 0;
        const bodyIsWiderThanViewport = document.body.getBoundingClientRect().width > window.innerWidth + 1;
        window.scrollTo(0, initialY);
        return rootCanScroll || bodyIsWiderThanViewport;
      });
      expect(hasPageOverflow, path).toBe(false);
    }
  });
});
