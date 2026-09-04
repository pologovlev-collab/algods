export type TwoPointersAction = 'move-left' | 'move-right' | 'found';

export interface TwoPointersStep {
  left: number;
  right: number;
  leftValue: number;
  rightValue: number;
  sum: number;
  action: TwoPointersAction;
}

export interface TwoPointersTrace {
  values: number[];
  target: number;
  steps: TwoPointersStep[];
  found: boolean;
  pair: { left: number; right: number } | null;
}

export function createTwoPointersTrace(values: readonly number[], target: number): TwoPointersTrace {
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];
    if (previous !== undefined && current !== undefined && previous > current) {
      throw new Error('Two pointers requires values sorted in nondecreasing order.');
    }
  }

  const steps: TwoPointersStep[] = [];
  let left = 0;
  let right = values.length - 1;

  while (left < right) {
    const leftValue = values[left];
    const rightValue = values[right];
    if (leftValue === undefined || rightValue === undefined) {
      throw new Error('Two-pointers boundaries moved outside the input array.');
    }

    const sum = leftValue + rightValue;
    const action: TwoPointersAction = sum === target
      ? 'found'
      : sum < target
        ? 'move-left'
        : 'move-right';
    steps.push({ left, right, leftValue, rightValue, sum, action });

    if (action === 'found') {
      return {
        values: [...values],
        target,
        steps,
        found: true,
        pair: { left, right },
      };
    }
    if (action === 'move-left') left += 1;
    else right -= 1;
  }

  return {
    values: [...values],
    target,
    steps,
    found: false,
    pair: null,
  };
}
