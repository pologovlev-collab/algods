export type TreeTraversalMode = 'dfs' | 'bfs';

export interface TreeLabNode {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
}

export interface TreeTraversalStep {
  current: number;
  frontierBefore: number[];
  added: number[];
  frontierAfter: number[];
  visited: number[];
}

export interface TreeTraversalTrace {
  mode: TreeTraversalMode;
  nodes: TreeLabNode[];
  root: number | null;
  steps: TreeTraversalStep[];
  order: number[];
}

export function createTreeTraversalTrace(
  nodes: readonly TreeLabNode[],
  root: number | null,
  mode: TreeTraversalMode,
): TreeTraversalTrace {
  const nodeById = new Map<number, TreeLabNode>();
  for (const node of nodes) {
    if (nodeById.has(node.id)) throw new Error(`Tree contains duplicate node ${node.id}.`);
    nodeById.set(node.id, node);
  }
  for (const node of nodes) {
    for (const child of [node.left, node.right]) {
      if (child !== null && !nodeById.has(child)) {
        throw new Error(`Tree node ${node.id} points to missing child ${child}.`);
      }
    }
  }
  if (root !== null && !nodeById.has(root)) throw new Error(`Tree root ${root} is missing.`);

  const frontier = root === null ? [] : [root];
  const visited = new Set<number>();
  const order: number[] = [];
  const steps: TreeTraversalStep[] = [];

  while (frontier.length > 0) {
    const frontierBefore = [...frontier];
    const current = frontier.shift();
    if (current === undefined) throw new Error('Tree traversal frontier became inconsistent.');
    if (visited.has(current)) throw new Error(`Tree traversal reached node ${current} more than once.`);
    visited.add(current);
    order.push(current);

    const node = nodeById.get(current);
    if (!node) throw new Error(`Tree traversal cannot resolve node ${current}.`);
    const added = [node.left, node.right].filter((child): child is number => child !== null);
    if (mode === 'dfs') frontier.unshift(...added);
    else frontier.push(...added);

    steps.push({
      current,
      frontierBefore,
      added,
      frontierAfter: [...frontier],
      visited: [...order],
    });
  }

  return {
    mode,
    nodes: nodes.map((node) => ({ ...node })),
    root,
    steps,
    order,
  };
}
