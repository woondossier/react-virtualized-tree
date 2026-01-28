import type { Node } from '../types';

/**
 * Generates a tree with the specified structure.
 * @param depth - Maximum depth of the tree
 * @param childrenPerNode - Number of children per node
 * @param expanded - Whether nodes should be expanded
 * @returns Generated tree nodes
 */
export function generateTree(depth: number, childrenPerNode: number, expanded = true): Node[] {
  let idCounter = 0;

  function createNode(currentDepth: number): Node {
    const id = ++idCounter;
    const node: Node = {
      id,
      name: `Node ${id}`,
      state: { expanded },
      children: [],
    };

    if (currentDepth < depth) {
      for (let i = 0; i < childrenPerNode; i++) {
        node.children!.push(createNode(currentDepth + 1));
      }
    }

    return node;
  }

  const roots: Node[] = [];
  for (let i = 0; i < childrenPerNode; i++) {
    roots.push(createNode(1));
  }

  return roots;
}

/**
 * Counts the total number of nodes in a tree.
 * @param nodes - Tree nodes
 * @returns Total node count
 */
export function countNodes(nodes: Node[]): number {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children ? countNodes(node.children) : 0);
  }, 0);
}

/**
 * Generates a flat wide tree (many root nodes, shallow depth).
 * @param rootCount - Number of root nodes
 * @param childrenPerRoot - Children per root
 * @returns Generated tree
 */
export function generateWideTree(rootCount: number, childrenPerRoot = 2): Node[] {
  let idCounter = 0;
  const roots: Node[] = [];

  for (let i = 0; i < rootCount; i++) {
    const rootId = ++idCounter;
    const children: Node[] = [];

    for (let j = 0; j < childrenPerRoot; j++) {
      children.push({
        id: ++idCounter,
        name: `Child ${idCounter}`,
        state: { expanded: false },
        children: [],
      });
    }

    roots.push({
      id: rootId,
      name: `Root ${rootId}`,
      state: { expanded: true },
      children,
    });
  }

  return roots;
}

/**
 * Generates a deep tree (few nodes per level, many levels).
 * @param depth - Depth of the tree
 * @returns Generated tree
 */
export function generateDeepTree(depth: number): Node[] {
  let idCounter = 0;

  function createChain(currentDepth: number): Node {
    const id = ++idCounter;
    const node: Node = {
      id,
      name: `Node ${id}`,
      state: { expanded: true },
      children: [],
    };

    if (currentDepth < depth) {
      node.children!.push(createChain(currentDepth + 1));
    }

    return node;
  }

  return [createChain(1)];
}

/**
 * Pre-generated tree sizes for consistent benchmarking.
 */
export const TREE_SIZES = {
  SMALL: { depth: 3, childrenPerNode: 3 }, // ~40 nodes
  MEDIUM: { depth: 4, childrenPerNode: 5 }, // ~780 nodes
  LARGE: { depth: 5, childrenPerNode: 5 }, // ~3,905 nodes
  XLARGE: { depth: 6, childrenPerNode: 4 }, // ~5,460 nodes
};
