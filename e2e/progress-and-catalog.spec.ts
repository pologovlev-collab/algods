import { expect, test } from '@playwright/test';

test('course completion persists and updates course and roadmap state @smoke', async ({ page }) => {
  await page.goto('/');
  await page.locator('.desktop-nav').getByRole('link', { name: 'Курс', exact: true }).click();
  await page.locator('[data-course-lesson][data-lesson-id="s00-l01"] a').click();

  const progress = page.locator('[data-lesson-id="s00-l01"]');
  const completed = progress.locator('[data-lesson-status-value="completed"]');
  await completed.click();
  await expect(completed).toHaveAttribute('aria-pressed', 'true');
  await expect(progress.locator('[data-lesson-state-label]')).toHaveText('Завершён');

  await page.reload();
  await expect(completed).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/course/');
  const courseLesson = page.locator('[data-course-lesson][data-lesson-id="s00-l01"]');
  await expect(courseLesson).toHaveAttribute('data-progress-state', 'completed');
  await expect(courseLesson.locator('[data-lesson-state-label]')).toHaveText('Завершён');

  await page.goto('/roadmap/');
  await expect(page.locator('.learning-landscape__desktop button[data-map-stage-id="0"]'))
    .toHaveAttribute('data-map-stage-state', 'in-progress');
});

test('practice filters and a task status remain deterministic after reload', async ({ page }) => {
  await page.goto('/practice/');

  await page.locator('[data-filter-provider]').selectOption('codewars');
  await page.locator('[data-filter-stage]').selectOption('3');
  await page.locator('[data-filter-tier]').selectOption('standard');
  await page.locator('[data-filter-mode]').selectOption('transfer');
  await page.locator('[data-filter-status]').selectOption('not-started');

  const count = page.locator('[data-filter-count]');
  const row = page.locator('[data-practice-row][data-problem-id="codewars:52597aa56021e91c93000cb0"]');
  await expect(count).toHaveText('1');
  await expect(row).toBeVisible();
  await expect(row.getByRole('link', { name: /Moving Zeros To The End/ })).toHaveAttribute(
    'href',
    'https://www.codewars.com/kata/52597aa56021e91c93000cb0',
  );

  await row.locator('[data-problem-status]').selectOption('solved-independent');
  await expect(count).toHaveText('0');

  await page.reload();
  await page.locator('[data-filter-provider]').selectOption('codewars');
  await page.locator('[data-filter-stage]').selectOption('3');
  await page.locator('[data-filter-tier]').selectOption('standard');
  await page.locator('[data-filter-mode]').selectOption('transfer');
  await page.locator('[data-filter-status]').selectOption('solved-independent');
  await expect(count).toHaveText('1');
  await expect(row).toBeVisible();
  await expect(row.locator('[data-problem-status]')).toHaveValue('solved-independent');
});

test('LeetCode 75 renders exactly 75 tasks and persists solved progress', async ({ page }) => {
  await page.goto('/leetcode-75/');

  const entries = page.locator('[data-leetcode-collection] [data-problem-id]');
  const firstStatus = entries.first().locator('[data-problem-status]');
  const gauge = page.locator('[data-progress-gauge]');
  await expect(entries).toHaveCount(75);
  await expect(gauge.locator('[data-gauge-value]')).toHaveText('0/75');

  await firstStatus.selectOption('solved-independent');
  await expect(gauge.locator('[data-gauge-value]')).toHaveText('1/75');
  await expect(gauge).toHaveAttribute('aria-valuenow', '1');

  await page.reload();
  await expect(entries).toHaveCount(75);
  await expect(firstStatus).toHaveValue('solved-independent');
  await expect(gauge.locator('[data-gauge-value]')).toHaveText('1/75');
});
