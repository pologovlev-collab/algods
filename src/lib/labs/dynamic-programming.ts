export interface DynamicProgrammingStep {
  kind: 'base' | 'transition';
  index: number;
  cost: number;
  dependencies: number[];
  tableBefore: Array<number | null>;
  value: number;
  tableAfter: Array<number | null>;
}

export interface DynamicProgrammingTrace {
  costs: number[];
  steps: DynamicProgrammingStep[];
  table: number[];
  answer: number;
  exitFrom: number | null;
}

export function createMinClimbCostTrace(costs: readonly number[]): DynamicProgrammingTrace {
  if (costs.some((cost) => !Number.isFinite(cost))) {
    throw new Error('Dynamic-programming trace requires finite costs.');
  }
  if (costs.length <= 1) {
    return { costs: [...costs], steps: [], table: [], answer: 0, exitFrom: null };
  }

  const table: Array<number | null> = Array.from({ length: costs.length }, () => null);
  const steps: DynamicProgrammingStep[] = [];

  for (const index of [0, 1]) {
    const cost = costs[index];
    if (cost === undefined) throw new Error('Dynamic-programming base index is missing.');
    const tableBefore = [...table];
    table[index] = cost;
    steps.push({
      kind: 'base',
      index,
      cost,
      dependencies: [],
      tableBefore,
      value: cost,
      tableAfter: [...table],
    });
  }

  for (let index = 2; index < costs.length; index += 1) {
    const cost = costs[index];
    const twoBack = table[index - 2];
    const oneBack = table[index - 1];
    if (cost === undefined || twoBack === null || twoBack === undefined || oneBack === null || oneBack === undefined) {
      throw new Error(`Dynamic-programming dependencies for state ${index} are not ready.`);
    }
    const tableBefore = [...table];
    const value = cost + Math.min(twoBack, oneBack);
    table[index] = value;
    steps.push({
      kind: 'transition',
      index,
      cost,
      dependencies: [index - 2, index - 1],
      tableBefore,
      value,
      tableAfter: [...table],
    });
  }

  const completeTable = table.map((value, index) => {
    if (value === null) throw new Error(`Dynamic-programming state ${index} was not computed.`);
    return value;
  });
  const last = completeTable.length - 1;
  const penultimateValue = completeTable[last - 1];
  const lastValue = completeTable[last];
  if (penultimateValue === undefined || lastValue === undefined) {
    throw new Error('Dynamic-programming final states are missing.');
  }
  const exitFrom = penultimateValue <= lastValue ? last - 1 : last;

  return {
    costs: [...costs],
    steps,
    table: completeTable,
    answer: completeTable[exitFrom] ?? 0,
    exitFrom,
  };
}
