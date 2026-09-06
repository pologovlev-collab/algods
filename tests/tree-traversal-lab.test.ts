import { describe, expect, it } from 'vitest';

import { createTreeTraversalTrace, type TreeLabNode } from '../src/lib/labs/tree-traversal';

const tree: TreeLabNode[] = [
  { id: 1, value: 1, left: 2, right: 3 },
  { id: 2, value: 2, left: 4, right: 5 },
  { id: 3, value: 3, left: null, right: 6 },
  { id: 4, value: 4, left: null, right: null },
  { id: 5, value: 5, left: null, right: null },
  { id: 6, value: 6, left: null, right: null },
];

describe('tree traversal learning trace', () => {
  it('uses a stack discipline for iterative preorder DFS', () => {
    const trace = createTreeTraversalTrace(tree, 1, 'dfs');

    expect(trace.order).toEqual([1, 2, 4, 5, 3, 6]);
    expect(trace.steps.slice(0, 2)).toEqual([
      {
        current: 1,
        frontierBefore: [1],
        added: [2, 3],
        frontierAfter: [2, 3],
        visited: [1],
      },
      {
        current: 2,
        frontierBefore: [2, 3],
        added: [4, 5],
        frontierAfter: [4, 5, 3],
        visited: [1, 2],
      },
    ]);
  });

  it('uses a queue discipline for breadth-first traversal', () => {
    const trace = createTreeTraversalTrace(tree, 1, 'bfs');

    expect(trace.order).toEqual([1, 2, 3, 4, 5, 6]);
    expect(trace.steps[1]).toEqual({
      current: 2,
      frontierBefore: [2, 3],
      added: [4, 5],
      frontierAfter: [3, 4, 5],
      visited: [1, 2],
    });
  });

  it('handles an empty tree', () => {
    expect(createTreeTraversalTrace([], null, 'dfs')).toEqual({
      mode: 'dfs',
      nodes: [],
      root: null,
      steps: [],
      order: [],
    });
  });

  it('rejects a child reference that is not present in the tree', () => {
    expect(() => createTreeTraversalTrace([
      { id: 1, value: 1, left: 2, right: null },
    ], 1, 'bfs')).toThrow('Tree node 1 points to missing child 2.');
  });
});
