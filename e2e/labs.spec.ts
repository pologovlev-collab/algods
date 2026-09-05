import { expect, test } from '@playwright/test';

test('Two Pointers prediction, final result, and reset focus remain stable @smoke', async ({ page }) => {
  await page.goto('/course/opposite-two-pointers/');
  const lab = page.locator('[data-two-pointers-lab]');
  const moveLeft = lab.locator('[data-two-predict="move-left"]');
  const next = lab.locator('[data-lab-next]');

  await expect(next).toBeDisabled();
  await moveLeft.focus();
  await moveLeft.press('Enter');
  await expect(lab.locator('[data-lab-feedback]')).toHaveAttribute('data-feedback-state', 'correct');
  await next.click();

  await moveLeft.click();
  await next.click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 3 / 4');
  await expect(lab.locator('[data-lab-explanation]')).toContainText('Пара найдена на индексах 2 и 3');

  await next.click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Итог · 4 / 4');
  await expect(lab.locator('[data-two-sum]')).toHaveText('Найдена сумма 19');

  await lab.locator('[data-lab-reset]').click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 1 / 4');
  await expect(moveLeft).toBeFocused();
});

test('Sliding Window requires shrinking before it can expand again', async ({ page }) => {
  await page.goto('/course/variable-sliding-window/');
  const lab = page.locator('[data-sliding-window-lab]');
  const expand = lab.locator('[data-window-predict="expand"]');
  const shrink = lab.locator('[data-window-predict="shrink"]');
  const next = lab.locator('[data-lab-next]');

  await expand.click();
  await next.click();
  await expand.click();
  await next.click();
  await expect(lab.locator('[data-window-sum]')).toHaveText('8 > 7');
  await expect(next).toBeDisabled();

  await shrink.click();
  await expect(lab.locator('[data-lab-feedback]')).toHaveAttribute('data-feedback-state', 'correct');
  await next.click();
  await expect(lab.locator('[data-window-bounds]')).toHaveText('[1, 2]');
  await expect(lab.locator('[data-window-sum]')).toHaveText('6 ≤ 7');
});

test('Binary Search uses the correct invariant in both lesson contexts', async ({ page }) => {
  await page.goto('/course/binary-search-invariant/');
  const exactLab = page.locator('[data-binary-lab]');
  const exactNext = exactLab.locator('[data-binary-next]');
  const exactReset = exactLab.locator('[data-binary-reset]');

  await expect(exactLab).toHaveAttribute('data-binary-mode', 'exact');
  await expect(exactLab.getByRole('heading', { name: 'Точный поиск значения 11' })).toBeVisible();
  await exactNext.focus();
  await exactNext.press('Enter');
  await expect(exactLab.locator('[data-binary-explanation]')).toContainText('a[3] = 6 < 11');
  await exactNext.press('Space');
  await expect(exactLab.locator('[data-binary-explanation]')).toContainText('Точное значение найдено');
  await exactNext.press('Enter');
  await expect(exactLab.locator('[data-binary-index="5"]')).toHaveAttribute('data-binary-state', 'result');
  await expect(exactLab.locator('[data-binary-explanation]')).toContainText('Ответ: индекс 5');
  await exactReset.focus();
  await exactReset.press('Enter');
  await expect(exactLab.locator('[data-binary-explanation]')).toContainText('закрытом диапазоне [0, 7]');
  await expect(exactReset).toBeFocused();

  await page.goto('/course/binary-search-boundaries/');
  const boundaryLab = page.locator('[data-binary-lab]');
  const boundaryNext = boundaryLab.locator('[data-binary-next]');
  const boundaryReset = boundaryLab.locator('[data-binary-reset]');

  await expect(boundaryLab).toHaveAttribute('data-binary-mode', 'lower-bound');
  await expect(boundaryLab.getByRole('heading', { name: 'Граница первого элемента ≥ 8' })).toBeVisible();
  for (let step = 0; step < 4; step += 1) {
    await boundaryNext.press(step % 2 === 0 ? 'Enter' : 'Space');
  }
  await expect(boundaryLab.locator('[data-binary-index="4"]')).toHaveAttribute('data-binary-state', 'result');
  await expect(boundaryLab.locator('[data-binary-explanation]')).toContainText('первое вхождение 8');
  await boundaryReset.focus();
  await boundaryReset.press('Space');
  await expect(boundaryLab.locator('[data-binary-explanation]')).toContainText('граница находится где-то в [0, 8)');
  await expect(boundaryReset).toBeFocused();
});
