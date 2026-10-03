import { expect, test } from '@playwright/test';
import { THEME_STORAGE_KEY } from '../src/lib/theme';
import { inspectLayout } from './helpers/layout';

const targets = ['/reference/binary-search/', '/reference/two-pointers/', '/reference/sliding-window/'];
for (const width of [360, 390, 430, 768, 1024, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`search answers are usable at ${width}px in ${theme}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
      for (const route of targets) {
        expect((await page.goto(`${route}?utm_source=telegram&utm_medium=social&utm_campaign=algods_launch_2026_10&utm_content=qa`))?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://algods.ru${route}`);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.getByRole('navigation', { name: 'Хлебные крошки' })).toBeVisible();
        const answerLinks = page.getByRole('navigation', { name: 'Быстрый ответ и следующий шаг' });
        const bounds = await answerLinks.boundingBox();
        expect(bounds && bounds.y + bounds.height < 1800, 'answer navigation within first two viewports').toBe(true);
        if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`${route.split('/')[2]}-intro.png`) });
        await answerLinks.getByRole('link', { name: 'Код C++ / Python' }).click();
        await expect(page.locator('#quick-code')).toBeInViewport();
        const python = page.locator('#quick-code [data-language-choice="python"]:visible').first();
        await python.click();
        await expect(page.locator('#quick-code .reference-code-example[data-code-language="python"]')).toBeVisible();
        await expect(page.locator('#quick-code .reference-code-example[data-code-language="cpp"]')).toBeHidden();
        if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`${route.split('/')[2]}-python.png`) });
        await page.locator('#quick-code [data-language-choice="cpp"]:visible').first().click();
        await expect(page.locator('#quick-code .reference-code-example[data-code-language="cpp"]')).toBeVisible();
        expect((await page.evaluate(inspectLayout)).issues, route).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await expect(page.locator('#quick-limits a[href="/practice/"]')).toBeVisible();
      }
      expect(errors).toEqual([]);
    });
  }
}
