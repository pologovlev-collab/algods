import { describe, expect, it } from 'vitest';

import { createLowerBoundTrace, getLowerBoundTraceFrame } from '../src/lib/binary-search-trace';

describe('lower-bound teaching trace', () => {
  it('shows how duplicates keep the left half in play', () => {
    expect(createLowerBoundTrace([1, 3, 3, 5], 3)).toEqual({
      values: [1, 3, 3, 5],
      target: 3,
      steps: [
        { lo: 0, hi: 4, mid: 2, midValue: 3, decision: 'move-left' },
        { lo: 0, hi: 2, mid: 1, midValue: 3, decision: 'move-left' },
        { lo: 0, hi: 1, mid: 0, midValue: 1, decision: 'move-right' },
      ],
      resultIndex: 1,
      found: true,
    });
  });

  it('returns the insertion boundary when the target is absent', () => {
    expect(createLowerBoundTrace([1, 3, 5], 4)).toEqual({
      values: [1, 3, 5],
      target: 4,
      steps: [
        { lo: 0, hi: 3, mid: 1, midValue: 3, decision: 'move-right' },
        { lo: 2, hi: 3, mid: 2, midValue: 5, decision: 'move-left' },
      ],
      resultIndex: 2,
      found: false,
    });
  });

  it('handles empty and single-element arrays without dereferencing outside the array', () => {
    expect(createLowerBoundTrace([], 8)).toEqual({
      values: [],
      target: 8,
      steps: [],
      resultIndex: 0,
      found: false,
    });
    expect(createLowerBoundTrace([8], 8).resultIndex).toBe(0);
    expect(createLowerBoundTrace([8], 9).resultIndex).toBe(1);
  });

  it('rejects unsorted input because the monotonic predicate would be invalid', () => {
    expect(() => createLowerBoundTrace([2, 1, 3], 2)).toThrow(
      'Binary search requires values sorted in nondecreasing order.',
    );
  });

  it('keeps the first decision highlight aligned with its pre-decision bounds', () => {
    const trace = createLowerBoundTrace([1, 3, 3, 6, 8, 11, 14, 19], 8);

    expect(getLowerBoundTraceFrame(trace, 0)).toEqual({
      kind: 'decision',
      lo: 0,
      hi: 8,
      mid: 4,
      midValue: 8,
      decision: 'move-left',
      nextLo: 0,
      nextHi: 4,
      cellStates: ['candidate', 'candidate', 'candidate', 'candidate', 'mid', 'candidate', 'candidate', 'candidate'],
    });
  });

  it('highlights only the computed boundary in the final frame', () => {
    const trace = createLowerBoundTrace([1, 3, 3, 6, 8, 11, 14, 19], 8);

    expect(getLowerBoundTraceFrame(trace, trace.steps.length)).toEqual({
      kind: 'result',
      resultIndex: 4,
      found: true,
      cellStates: ['discarded', 'discarded', 'discarded', 'discarded', 'result', 'discarded', 'discarded', 'discarded'],
    });
  });
});
