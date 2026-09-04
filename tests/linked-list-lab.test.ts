import { describe, expect, it } from 'vitest';

import { createLinkedListReversalTrace } from '../src/lib/labs/linked-list-reversal';

describe('linked-list reversal learning trace', () => {
  it('preserves the untouched tail before reversing the current link', () => {
    const trace = createLinkedListReversalTrace([1, 2, 3]);

    expect(trace.steps.slice(0, 3)).toEqual([
      {
        iteration: 0,
        operation: 'save-next',
        prev: null,
        cur: 0,
        savedNext: 1,
        links: [1, 2, null],
      },
      {
        iteration: 0,
        operation: 'reverse-link',
        prev: null,
        cur: 0,
        savedNext: 1,
        links: [null, 2, null],
      },
      {
        iteration: 0,
        operation: 'advance',
        prev: 0,
        cur: 1,
        savedNext: 1,
        links: [null, 2, null],
      },
    ]);
  });

  it('reverses several nodes without losing any value', () => {
    const trace = createLinkedListReversalTrace([1, 2, 3, 4]);

    expect(trace.steps.map(({ operation }) => operation)).toEqual([
      'save-next', 'reverse-link', 'advance',
      'save-next', 'reverse-link', 'advance',
      'save-next', 'reverse-link', 'advance',
      'save-next', 'reverse-link', 'advance',
    ]);
    expect(trace.finalLinks).toEqual([null, 0, 1, 2]);
    expect(trace.resultHead).toBe(3);
    expect(trace.resultValues).toEqual([4, 3, 2, 1]);
  });

  it('handles an empty list', () => {
    expect(createLinkedListReversalTrace([])).toEqual({
      values: [],
      initialLinks: [],
      steps: [],
      finalLinks: [],
      resultHead: null,
      resultValues: [],
    });
  });

  it('handles a single node whose reversed next remains null', () => {
    const trace = createLinkedListReversalTrace([7]);

    expect(trace.steps).toHaveLength(3);
    expect(trace.finalLinks).toEqual([null]);
    expect(trace.resultHead).toBe(0);
    expect(trace.resultValues).toEqual([7]);
  });
});
