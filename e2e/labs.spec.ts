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
  await expect(boundaryLab.locator('.binary-lab__heading > p:not(.eyebrow)')).toHaveText(
    'Инвариант: кандидат ответа p остаётся в закрытом диапазоне [lo, hi], а ещё не классифицированные позиции массива — в полуинтервале [lo, hi). Значение hi = n допустимо.',
  );
  for (let step = 0; step < 4; step += 1) {
    await boundaryNext.press(step % 2 === 0 ? 'Enter' : 'Space');
  }
  await expect(boundaryLab.locator('[data-binary-index="4"]')).toHaveAttribute('data-binary-state', 'result');
  await expect(boundaryLab.locator('[data-binary-explanation]')).toContainText('первое вхождение 8');
  await boundaryReset.focus();
  await boundaryReset.press('Space');
  await expect(boundaryLab.locator('[data-binary-explanation]')).toHaveText(
    'Начальное состояние: кандидат ответа p находится в закрытом диапазоне [0, 8]; позиции массива [0, 8) ещё не классифицированы, а 8 — допустимая граница после массива.',
  );
  await expect(boundaryReset).toBeFocused();
});

test('Dynamic Programming reveals dependencies before each transition and reaches the optimum', async ({ page }) => {
  await page.goto('/course/dp-tabulation-and-order/');
  const lab = page.locator('[data-dp-lab]');
  const next = lab.locator('[data-lab-next]');
  const previousTwo = lab.locator('[data-dp-predict="previous-two"]');

  await expect(lab.locator('[data-dp-formula]')).toHaveText('dp[0] = 10');
  await next.click();
  await next.click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 3 / 6');
  await expect(next).toBeDisabled();

  for (let transition = 0; transition < 3; transition += 1) {
    await previousTwo.press(transition % 2 === 0 ? 'Enter' : 'Space');
    await expect(lab.locator('[data-lab-feedback]')).toHaveAttribute('data-feedback-state', 'correct');
    await next.click();
  }

  await expect(lab.locator('[data-lab-step]')).toHaveText('Итог · 6 / 6');
  await expect(lab.locator('[data-dp-formula]')).toHaveText('ответ = 19');
  await expect(lab.locator('[data-dp-cell="3"]')).toHaveAttribute('data-cell-state', 'result');

  await lab.locator('[data-lab-reset]').click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 1 / 6');
  await expect(next).toBeFocused();
});

test('Linked List reversal preserves the tail through every save-reverse-advance cycle', async ({ page }) => {
  await page.goto('/course/linked-list-relinking/');
  const lab = page.locator('[data-linked-list-lab]');
  const saveNext = lab.locator('[data-list-predict="save-next"]');
  const next = lab.locator('[data-lab-next]');

  await expect(next).toBeDisabled();
  for (let step = 0; step < 12; step += 1) {
    if (step % 3 === 0) {
      await saveNext.press(step % 2 === 0 ? 'Enter' : 'Space');
      await expect(lab.locator('[data-lab-feedback]')).toHaveAttribute('data-feedback-state', 'correct');
    }
    await next.click();
  }

  await expect(lab.locator('[data-lab-step]')).toHaveText('Итог · 13 / 13');
  await expect(lab.locator('[data-list-operation]')).toHaveText('Результат: 4 → 3 → 2 → 1 → ∅');
  await expect(lab.locator('[data-list-prev]')).toHaveText('head = 3');

  await lab.locator('[data-lab-reset]').click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 1 / 13');
  await expect(saveNext).toBeFocused();
});

test('Tree traversal switches discipline and completes BFS in level order', async ({ page }) => {
  await page.goto('/course/tree-model-and-traversals/');
  const lab = page.locator('[data-tree-traversal-lab]');
  const bfs = lab.locator('[data-tree-mode="bfs"]');
  const next = lab.locator('[data-lab-next]');

  await bfs.press('Enter');
  await expect(bfs).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-tree-frontier-label]')).toHaveText('Очередь после шага');

  for (const expected of [2, 3, 4, 5, 6]) {
    await lab.locator(`[data-tree-predict="${expected}"]`).click();
    await expect(lab.locator('[data-lab-feedback]')).toHaveAttribute('data-feedback-state', 'correct');
    await next.click();
  }
  await next.click();

  await expect(lab.locator('[data-lab-step]')).toHaveText('Итог · 7 / 7');
  await expect(lab.locator('[data-tree-visited]')).toHaveText('1 → 2 → 3 → 4 → 5 → 6');
  await expect(lab.locator('[data-tree-current]')).toHaveText('обход завершён');

  await lab.locator('[data-lab-reset]').click();
  await expect(lab.locator('[data-lab-step]')).toHaveText('Шаг 1 / 7');
  await expect(lab.locator('[data-tree-predict="2"]')).toBeFocused();
});
