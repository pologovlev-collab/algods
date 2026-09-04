export type LinkedListOperation = 'save-next' | 'reverse-link' | 'advance';

export interface LinkedListReversalStep {
  iteration: number;
  operation: LinkedListOperation;
  prev: number | null;
  cur: number | null;
  savedNext: number | null;
  links: Array<number | null>;
}

export interface LinkedListReversalTrace {
  values: number[];
  initialLinks: Array<number | null>;
  steps: LinkedListReversalStep[];
  finalLinks: Array<number | null>;
  resultHead: number | null;
  resultValues: number[];
}

export function createLinkedListReversalTrace(values: readonly number[]): LinkedListReversalTrace {
  const initialLinks = values.map((_, index) => index + 1 < values.length ? index + 1 : null);
  const links = [...initialLinks];
  const steps: LinkedListReversalStep[] = [];
  let prev: number | null = null;
  let cur: number | null = values.length > 0 ? 0 : null;
  let savedNext: number | null = null;
  let iteration = 0;

  while (cur !== null) {
    savedNext = links[cur] ?? null;
    steps.push({ iteration, operation: 'save-next', prev, cur, savedNext, links: [...links] });

    links[cur] = prev;
    steps.push({ iteration, operation: 'reverse-link', prev, cur, savedNext, links: [...links] });

    prev = cur;
    cur = savedNext;
    steps.push({ iteration, operation: 'advance', prev, cur, savedNext, links: [...links] });
    iteration += 1;
  }

  const resultValues: number[] = [];
  const seen = new Set<number>();
  let node = prev;
  while (node !== null) {
    if (seen.has(node)) throw new Error('Reversed linked list unexpectedly contains a cycle.');
    seen.add(node);
    const value = values[node];
    if (value === undefined) throw new Error('Reversed linked list points outside the input nodes.');
    resultValues.push(value);
    node = links[node] ?? null;
  }

  return {
    values: [...values],
    initialLinks,
    steps,
    finalLinks: [...links],
    resultHead: prev,
    resultValues,
  };
}
