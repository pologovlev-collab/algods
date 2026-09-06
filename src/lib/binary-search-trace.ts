export interface ExactSearchStep {
  lo: number;
  hi: number;
  mid: number;
  midValue: number;
  decision: 'move-left' | 'move-right' | 'found';
}

export interface ExactSearchTrace {
  values: number[];
  target: number;
  steps: ExactSearchStep[];
  resultIndex: number;
  found: boolean;
}

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

export type LowerBoundCellState = 'candidate' | 'mid' | 'discarded' | 'result';

export type ExactSearchTraceFrame =
  | {
      kind: 'initial';
      lo: number;
      hi: number;
      cellStates: LowerBoundCellState[];
    }
  | ({
      kind: 'decision';
      nextLo: number;
      nextHi: number;
      cellStates: LowerBoundCellState[];
    } & ExactSearchStep)
  | {
      kind: 'result';
      resultIndex: number;
      found: boolean;
      cellStates: LowerBoundCellState[];
    };

export type LowerBoundTraceFrame =
  | {
      kind: 'initial';
      lo: number;
      hi: number;
      cellStates: LowerBoundCellState[];
    }
  | ({
      kind: 'decision';
      nextLo: number;
      nextHi: number;
      cellStates: LowerBoundCellState[];
    } & LowerBoundStep)
  | {
      kind: 'result';
      resultIndex: number;
      found: boolean;
      cellStates: LowerBoundCellState[];
    };

function assertSorted(values: readonly number[]) {
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];
    if (previous !== undefined && current !== undefined && previous > current) {
      throw new Error('Binary search requires values sorted in nondecreasing order.');
    }
  }
}

export function createExactSearchTrace(values: readonly number[], target: number): ExactSearchTrace {
  assertSorted(values);

  let lo = 0;
  let hi = values.length - 1;
  let resultIndex = -1;
  const steps: ExactSearchStep[] = [];

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const midValue = values[mid];
    if (midValue === undefined) {
      throw new Error('Binary-search bounds moved outside the input array.');
    }
    const decision = midValue === target
      ? 'found'
      : midValue > target ? 'move-left' : 'move-right';

    steps.push({ lo, hi, mid, midValue, decision });
    if (decision === 'found') {
      resultIndex = mid;
      break;
    }
    if (decision === 'move-left') {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return {
    values: [...values],
    target,
    steps,
    resultIndex,
    found: resultIndex >= 0,
  };
}

export function getExactSearchTraceFrame(trace: ExactSearchTrace, position: number): ExactSearchTraceFrame {
  if (position < 0) {
    return {
      kind: 'initial',
      lo: 0,
      hi: trace.values.length - 1,
      cellStates: trace.values.map(() => 'candidate'),
    };
  }

  if (position >= trace.steps.length) {
    return {
      kind: 'result',
      resultIndex: trace.resultIndex,
      found: trace.found,
      cellStates: trace.values.map((_, index) =>
        trace.found && index === trace.resultIndex ? 'result' : 'discarded'),
    };
  }

  const step = trace.steps[position];
  if (!step) {
    throw new Error('Binary-search trace position does not point to a decision step.');
  }

  return {
    kind: 'decision',
    ...step,
    nextLo: step.decision === 'move-right' ? step.mid + 1 : step.lo,
    nextHi: step.decision === 'move-left' ? step.mid - 1 : step.hi,
    cellStates: trace.values.map((_, index) =>
      index === step.mid ? 'mid' : index >= step.lo && index <= step.hi ? 'candidate' : 'discarded',
    ),
  };
}

export function getExactSearchTraceFrames(trace: ExactSearchTrace): ExactSearchTraceFrame[] {
  return Array.from(
    { length: trace.steps.length + 1 },
    (_, position) => getExactSearchTraceFrame(trace, position),
  );
}

export function createLowerBoundTrace(values: readonly number[], target: number): LowerBoundTrace {
  assertSorted(values);

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

export function getLowerBoundTraceFrame(trace: LowerBoundTrace, position: number): LowerBoundTraceFrame {
  if (position < 0) {
    return {
      kind: 'initial',
      lo: 0,
      hi: trace.values.length,
      cellStates: trace.values.map(() => 'candidate'),
    };
  }

  if (position >= trace.steps.length) {
    return {
      kind: 'result',
      resultIndex: trace.resultIndex,
      found: trace.found,
      cellStates: trace.values.map((_, index) => (index === trace.resultIndex ? 'result' : 'discarded')),
    };
  }

  const step = trace.steps[position];
  if (!step) {
    throw new Error('Binary-search trace position does not point to a decision step.');
  }

  return {
    kind: 'decision',
    ...step,
    nextLo: step.decision === 'move-right' ? step.mid + 1 : step.lo,
    nextHi: step.decision === 'move-left' ? step.mid : step.hi,
    cellStates: trace.values.map((_, index) =>
      index === step.mid ? 'mid' : index >= step.lo && index < step.hi ? 'candidate' : 'discarded',
    ),
  };
}

export function getLowerBoundTraceFrames(trace: LowerBoundTrace): LowerBoundTraceFrame[] {
  return Array.from(
    { length: trace.steps.length + 1 },
    (_, position) => getLowerBoundTraceFrame(trace, position),
  );
}
