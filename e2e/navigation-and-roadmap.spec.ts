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

test('critical pages retain baseline document and control semantics', async ({ page }) => {
  for (const path of [
    '/',
    '/roadmap/',
    '/course/opposite-two-pointers/',
    '/practice/',
    '/leetcode-75/',
    '/reference/',
  ]) {
    await page.goto(path);
    const issues = await page.evaluate(() => {
      const findings: string[] = [];
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);
      const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
      if (duplicateIds.length > 0) findings.push(`duplicate ids: ${duplicateIds.join(', ')}`);
      if (document.querySelectorAll('main#main-content').length !== 1) findings.push('missing unique main landmark');
      if (document.querySelectorAll('h1').length !== 1) findings.push('page must expose one h1');
      if (document.querySelector('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])') !== null) {
        findings.push('positive tabindex');
      }
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input:not([type="hidden"]), select, textarea',
      ).forEach((control) => {
        if ((control.labels?.length ?? 0) === 0 && !control.getAttribute('aria-label')) {
          findings.push(`unlabelled ${control.tagName.toLowerCase()}`);
        }
      });
      document.querySelectorAll<HTMLButtonElement | HTMLElement>('button, summary').forEach((control) => {
        const name = control.getAttribute('aria-label') ?? control.textContent ?? '';
        if (name.trim().length === 0) findings.push(`unnamed ${control.tagName.toLowerCase()}`);
      });
      document.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
        if (!image.hasAttribute('alt')) findings.push(`image without alt: ${image.src}`);
      });
      return findings;
    });
    expect(issues, path).toEqual([]);
  }

  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Перейти к содержанию' });
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.locator('main#main-content')).toBeFocused();
  await expect(page.getByRole('button', { name: /тему/i })).toBeVisible();

  const resetProgress = page.getByRole('button', { name: 'Сбросить прогресс' });
  await resetProgress.focus();
  await resetProgress.press('Enter');
  const resetDialog = page.getByRole('dialog', { name: 'Сбросить локальный прогресс?' });
  await expect(resetDialog).toBeVisible();
  await expect(resetDialog.getByRole('button', { name: 'Отмена' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(resetDialog).toBeHidden();
  await expect(resetProgress).toBeFocused();
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

    const filterPanel = page.locator('[data-practice-filter-panel]');
    const filterSummary = filterPanel.locator('summary');
    await expect(filterPanel).not.toHaveAttribute('open', '');
    await expect(page.locator('[data-filter-count]')).toBeVisible();
    await filterSummary.press('Enter');
    await expect(filterPanel).toHaveAttribute('open', '');
    await expect(filterPanel.locator('[data-filter-query]')).toBeVisible();
    await filterSummary.press('Space');
    await expect(filterPanel).not.toHaveAttribute('open', '');

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
