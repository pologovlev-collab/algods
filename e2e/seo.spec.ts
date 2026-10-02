import { expect, test } from '@playwright/test';

test('lesson SEO overrides keep the teaching H1 and summary', async ({ page }) => {
  await page.goto('/course/variable-sliding-window/');
  await expect(page).toHaveTitle('Скользящее окно (Sliding Window): C++ и Python — AlgoDS');
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
