export interface LowerBoundStep {
  lo: number;
  hi: number;
  mid: number;
  midValue: number;
  decision: 'move-left' | 'move-right';
}

export interface LowerBoundTrace {
  values: number[];
  target: number;
  steps: LowerBoundStep[];
  resultIndex: number;
  found: boolean;
}

export function createLowerBoundTrace(values: readonly number[], target: number): LowerBoundTrace {
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];
    if (previous !== undefined && current !== undefined && previous > current) {
      throw new Error('Binary search requires values sorted in nondecreasing order.');
    }
  }

  let lo = 0;
  let hi = values.length;
  const steps: LowerBoundStep[] = [];

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const midValue = values[mid];
    if (midValue === undefined) {
      throw new Error('Binary-search bounds moved outside the input array.');
    }
    const decision = midValue >= target ? 'move-left' : 'move-right';

    steps.push({ lo, hi, mid, midValue, decision });
    if (decision === 'move-left') {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return {
    values: [...values],
    target,
    steps,
    resultIndex: lo,
    found: lo < values.length && values[lo] === target,
  };
}
