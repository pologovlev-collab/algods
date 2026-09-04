export type SlidingWindowOperation = 'expand' | 'shrink';
export type SlidingWindowAction = SlidingWindowOperation | 'complete';

export interface SlidingWindowBest {
  left: number;
  right: number;
  length: number;
  sum: number;
}

export interface SlidingWindowStep {
  operation: SlidingWindowOperation;
  changedIndex: number;
  left: number;
  right: number;
  sum: number;
  valid: boolean;
  bestLength: number;
  best: SlidingWindowBest | null;
  nextAction: SlidingWindowAction;
}

export interface SlidingWindowTrace {
  values: number[];
  maxSum: number;
  steps: SlidingWindowStep[];
  best: SlidingWindowBest | null;
}

export function createSlidingWindowTrace(values: readonly number[], maxSum: number): SlidingWindowTrace {
  if (maxSum < 0) throw new Error('Sliding-window sum trace requires a nonnegative limit.');
  if (values.some((value) => value < 0)) {
    throw new Error('Sliding-window sum trace requires nonnegative values.');
  }

  const steps: SlidingWindowStep[] = [];
  let best: SlidingWindowBest | null = null;
  let left = 0;
  let right = -1;
  let sum = 0;

  const record = (operation: SlidingWindowOperation, changedIndex: number) => {
    const valid = sum <= maxSum;
    const length = Math.max(0, right - left + 1);
    if (valid && length > (best?.length ?? 0)) {
      best = { left, right, length, sum };
    }
    const nextAction: SlidingWindowAction = !valid
      ? 'shrink'
      : right + 1 < values.length
        ? 'expand'
        : 'complete';
    steps.push({
      operation,
      changedIndex,
      left,
      right,
      sum,
      valid,
      bestLength: best?.length ?? 0,
      best: best ? { ...best } : null,
      nextAction,
    });
  };

  while (right + 1 < values.length) {
    right += 1;
    const value = values[right];
    if (value === undefined) throw new Error('Sliding-window right boundary moved outside the input array.');
    sum += value;
    record('expand', right);

    while (sum > maxSum && left <= right) {
      const changedIndex = left;
      const removed = values[left];
      if (removed === undefined) throw new Error('Sliding-window left boundary moved outside the input array.');
      sum -= removed;
      left += 1;
      record('shrink', changedIndex);
    }
  }

  return { values: [...values], maxSum, steps, best };
}
