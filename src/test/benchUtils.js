/**
 * Utility functions for generating test trees of various sizes for benchmarking.
 */

/**
 * Generates a tree with the specified structure.
 * @param {number} depth - Maximum depth of the tree
 * @param {number} childrenPerNode - Number of children per node
 * @param {boolean} expanded - Whether nodes should be expanded
 * @returns {Object[]} - Generated tree nodes
 */
export function generateTree(depth, childrenPerNode, expanded = true) {
  let idCounter = 0;

  function createNode(currentDepth) {
    const id = ++idCounter;
    const node = {
      id,
      name: `Node ${id}`,
      state: { expanded },
      children: [],
    };

    if (currentDepth < depth) {
      for (let i = 0; i < childrenPerNode; i++) {
        node.children.push(createNode(currentDepth + 1));
      }
    }

    return node;
  }

  const roots = [];
  for (let i = 0; i < childrenPerNode; i++) {
    roots.push(createNode(1));
  }

  return roots;
}

/**
 * Counts the total number of nodes in a tree.
 * @param {Object[]} nodes - Tree nodes
 * @returns {number} - Total node count
 */
export function countNodes(nodes) {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children ? countNodes(node.children) : 0);
  }, 0);
}

/**
 * Generates a flat wide tree (many root nodes, shallow depth).
 * @param {number} rootCount - Number of root nodes
 * @param {number} childrenPerRoot - Children per root
 * @returns {Object[]} - Generated tree
 */
export function generateWideTree(rootCount, childrenPerRoot = 2) {
  let idCounter = 0;
  const roots = [];

  for (let i = 0; i < rootCount; i++) {
    const rootId = ++idCounter;
    const children = [];

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
 * @param {number} depth - Depth of the tree
 * @returns {Object[]} - Generated tree
 */
export function generateDeepTree(depth) {
  let idCounter = 0;

  function createChain(currentDepth) {
    const id = ++idCounter;
    const node = {
      id,
      name: `Node ${id}`,
      state: { expanded: true },
      children: [],
    };

    if (currentDepth < depth) {
      node.children.push(createChain(currentDepth + 1));
    }

    return node;
  }

  return [createChain(1)];
}

/**
 * Pre-generated tree sizes for consistent benchmarking.
 */
export const TREE_SIZES = {
  SMALL: { depth: 3, childrenPerNode: 3 },   // ~40 nodes
  MEDIUM: { depth: 4, childrenPerNode: 5 },  // ~780 nodes
  LARGE: { depth: 5, childrenPerNode: 5 },   // ~3,905 nodes
  XLARGE: { depth: 6, childrenPerNode: 4 },  // ~5,460 nodes
};
