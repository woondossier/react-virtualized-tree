import type { Node, FlattenedNode, NodeId, NodePath } from '../types';

export const isNodeExpanded = (node: Node): boolean => Boolean(node.state?.expanded);
export const nodeHasChildren = (node: Node): boolean => Boolean(node.children && node.children.length);

/**
 * Original implementation using reduce and spread operators.
 * Kept for benchmarking comparison.
 */
export const getFlattenedTreeOriginal = (nodes: Node[], parents: NodeId[] = []): FlattenedNode[] =>
  nodes.reduce<FlattenedNode[]>((flattenedTree, node) => {
    const deepness = parents.length;
    const nodeWithHelpers: FlattenedNode = { ...node, deepness, parents };

    if (!nodeHasChildren(node) || !isNodeExpanded(node)) {
      return [...flattenedTree, nodeWithHelpers];
    }

    return [
      ...flattenedTree,
      nodeWithHelpers,
      ...getFlattenedTreeOriginal(node.children!, [...parents, node.id]),
    ];
  }, []);

/**
 * Internal recursive implementation that mutates parents array for performance.
 */
const flattenTreeRecursive = (
  nodes: Node[],
  parents: NodeId[],
  result: FlattenedNode[]
): void => {
  const deepness = parents.length;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // Must copy parents array since we mutate it during traversal
    const nodeWithHelpers: FlattenedNode = { ...node, deepness, parents: parents.slice() };
    result.push(nodeWithHelpers);

    if (nodeHasChildren(node) && isNodeExpanded(node)) {
      parents.push(node.id);
      flattenTreeRecursive(node.children!, parents, result);
      parents.pop();
    }
  }
};

/**
 * Optimized implementation using mutation and avoiding spread operators.
 * Copies parents once at entry, then mutates internally.
 */
export const getFlattenedTree = (nodes: Node[], parents: NodeId[] = []): FlattenedNode[] => {
  const result: FlattenedNode[] = [];
  flattenTreeRecursive(nodes, [...parents], result);
  return result;
};

export const getFlattenedTreePaths = (nodes: Node[], parents: NodeId[] = []): NodePath[] => {
  const paths: NodePath[] = [];

  for (const node of nodes) {
    const { id } = node;

    if (!nodeHasChildren(node) || !isNodeExpanded(node)) {
      paths.push(parents.concat(id));
    } else {
      paths.push(parents.concat(id));
      paths.push(...getFlattenedTreePaths(node.children!, [...parents, id]));
    }
  }

  return paths;
};

export const doesChangeAffectFlattenedTree = (previousNode: Node, nextNode: Node): boolean => {
  return isNodeExpanded(previousNode) !== isNodeExpanded(nextNode);
};
