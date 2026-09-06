import { describe, expect, it } from 'vitest';

import { createMinClimbCostTrace } from '../src/lib/labs/dynamic-programming';

describe('dynamic-programming learning trace', () => {
  it('records bases before the first transition', () => {
    const trace = createMinClimbCostTrace([10, 15, 20]);

    expect(trace.steps).toEqual([
      {
        kind: 'base',
        index: 0,
        cost: 10,
        dependencies: [],
        tableBefore: [null, null, null],
        value: 10,
        tableAfter: [10, null, null],
      },
      {
        kind: 'base',
        index: 1,
        cost: 15,
        dependencies: [],
        tableBefore: [10, null, null],
        value: 15,
        tableAfter: [10, 15, null],
      },
      {
        kind: 'transition',
        index: 2,
        cost: 20,
        dependencies: [0, 1],
        tableBefore: [10, 15, null],
        value: 30,
        tableAfter: [10, 15, 30],
      },
    ]);
    expect(trace.answer).toBe(15);
    expect(trace.exitFrom).toBe(1);
  });

  it('computes every transition only after both dependencies are ready', () => {
    const trace = createMinClimbCostTrace([10, 15, 20, 4, 6]);

    expect(trace.table).toEqual([10, 15, 30, 19, 25]);
    expect(trace.steps.slice(2).map(({ index, dependencies, value }) => ({ index, dependencies, value }))).toEqual([
      { index: 2, dependencies: [0, 1], value: 30 },
      { index: 3, dependencies: [1, 2], value: 19 },
      { index: 4, dependencies: [2, 3], value: 25 },
    ]);
    expect(trace.answer).toBe(19);
    expect(trace.exitFrom).toBe(3);
  });

  it('handles edge sizes before allocating transition states', () => {
    expect(createMinClimbCostTrace([])).toMatchObject({ steps: [], table: [], answer: 0, exitFrom: null });
    expect(createMinClimbCostTrace([7])).toMatchObject({ steps: [], table: [], answer: 0, exitFrom: null });
    expect(createMinClimbCostTrace([5, 6])).toMatchObject({ table: [5, 6], answer: 5, exitFrom: 0 });
  });

  it('rejects non-finite costs that cannot form a meaningful table', () => {
    expect(() => createMinClimbCostTrace([1, Number.POSITIVE_INFINITY])).toThrow(
      'Dynamic-programming trace requires finite costs.',
    );
  });
});
