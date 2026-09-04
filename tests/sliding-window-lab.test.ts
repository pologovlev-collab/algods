import { describe, expect, it } from 'vitest';

import { createSlidingWindowTrace } from '../src/lib/labs/sliding-window';

describe('sliding-window learning trace', () => {
  it('makes every expand-or-shrink decision deterministic', () => {
    const trace = createSlidingWindowTrace([2, 1, 5, 1, 3], 7);

    expect(trace.steps.map((step) => ({
      operation: step.operation,
      left: step.left,
      right: step.right,
      sum: step.sum,
      valid: step.valid,
      bestLength: step.bestLength,
      nextAction: step.nextAction,
    }))).toEqual([
      { operation: 'expand', left: 0, right: 0, sum: 2, valid: true, bestLength: 1, nextAction: 'expand' },
      { operation: 'expand', left: 0, right: 1, sum: 3, valid: true, bestLength: 2, nextAction: 'expand' },
      { operation: 'expand', left: 0, right: 2, sum: 8, valid: false, bestLength: 2, nextAction: 'shrink' },
      { operation: 'shrink', left: 1, right: 2, sum: 6, valid: true, bestLength: 2, nextAction: 'expand' },
      { operation: 'expand', left: 1, right: 3, sum: 7, valid: true, bestLength: 3, nextAction: 'expand' },
      { operation: 'expand', left: 1, right: 4, sum: 10, valid: false, bestLength: 3, nextAction: 'shrink' },
      { operation: 'shrink', left: 2, right: 4, sum: 9, valid: false, bestLength: 3, nextAction: 'shrink' },
      { operation: 'shrink', left: 3, right: 4, sum: 4, valid: true, bestLength: 3, nextAction: 'complete' },
    ]);
    expect(trace.steps[3]?.best).toEqual({ left: 0, right: 1, length: 2, sum: 3 });
    expect(trace.steps[4]?.best).toEqual({ left: 1, right: 3, length: 3, sum: 7 });
    expect(trace.best).toEqual({ left: 1, right: 3, length: 3, sum: 7 });
  });

  it('can shrink past a single value that already violates the limit', () => {
    const trace = createSlidingWindowTrace([9, 2], 4);

    expect(trace.steps.slice(0, 2).map(({ left, right, sum, valid, nextAction }) => ({
      left,
      right,
      sum,
      valid,
      nextAction,
    }))).toEqual([
      { left: 0, right: 0, sum: 9, valid: false, nextAction: 'shrink' },
      { left: 1, right: 0, sum: 0, valid: true, nextAction: 'expand' },
    ]);
    expect(trace.best).toEqual({ left: 1, right: 1, length: 1, sum: 2 });
  });

  it('handles an empty sequence as a finished trace', () => {
    expect(createSlidingWindowTrace([], 7)).toEqual({
      values: [],
      maxSum: 7,
      steps: [],
      best: null,
    });
  });

  it('rejects inputs that break the monotonic shrinking argument', () => {
    expect(() => createSlidingWindowTrace([2, -1, 3], 4)).toThrow(
      'Sliding-window sum trace requires nonnegative values.',
    );
    expect(() => createSlidingWindowTrace([1, 2], -1)).toThrow(
      'Sliding-window sum trace requires a nonnegative limit.',
    );
  });
});
