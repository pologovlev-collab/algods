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
