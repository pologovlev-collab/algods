import { describe, expect, it } from 'vitest';

import { createTwoPointersTrace } from '../src/lib/labs/two-pointers';

describe('two-pointers learning trace', () => {
  it('records the boundary that can be discarded at every comparison', () => {
    expect(createTwoPointersTrace([2, 5, 7, 12], 19)).toEqual({
      values: [2, 5, 7, 12],
      target: 19,
      steps: [
        { left: 0, right: 3, leftValue: 2, rightValue: 12, sum: 14, action: 'move-left' },
        { left: 1, right: 3, leftValue: 5, rightValue: 12, sum: 17, action: 'move-left' },
        { left: 2, right: 3, leftValue: 7, rightValue: 12, sum: 19, action: 'found' },
      ],
      found: true,
      pair: { left: 2, right: 3 },
    });
  });

  it('stops at crossed boundaries when no pair exists', () => {
    const trace = createTwoPointersTrace([1, 2, 4, 8], 7);

    expect(trace.steps.map(({ left, right, action }) => ({ left, right, action }))).toEqual([
      { left: 0, right: 3, action: 'move-right' },
      { left: 0, right: 2, action: 'move-left' },
      { left: 1, right: 2, action: 'move-left' },
    ]);
    expect(trace.found).toBe(false);
    expect(trace.pair).toBeNull();
  });

  it('can use equal values stored at two different indices', () => {
    const trace = createTwoPointersTrace([3, 3], 6);

    expect(trace.steps).toEqual([
      { left: 0, right: 1, leftValue: 3, rightValue: 3, sum: 6, action: 'found' },
    ]);
    expect(trace.pair).toEqual({ left: 0, right: 1 });
  });

  it('handles empty and single-value inputs without reading outside the array', () => {
    expect(createTwoPointersTrace([], 4).steps).toEqual([]);
    expect(createTwoPointersTrace([4], 8)).toMatchObject({ steps: [], found: false, pair: null });
  });

  it('rejects unsorted input because pointer movement would not be justified', () => {
    expect(() => createTwoPointersTrace([2, 7, 3], 9)).toThrow(
      'Two pointers requires values sorted in nondecreasing order.',
    );
  });
});
