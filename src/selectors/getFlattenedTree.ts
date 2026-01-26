import type { Node, FlattenedNode, NodeId, NodePath } from '../types';

export const isNodeExpanded = (node: Node): boolean => Boolean(node.state?.expanded);
export const nodeHasChildren = (node: Node): boolean => Boolean(node.children && node.children.length);

export const getFlattenedTree = (nodes: Node[], parents: NodeId[] = []): FlattenedNode[] =>
  nodes.reduce<FlattenedNode[]>((flattenedTree, node) => {
    const deepness = parents.length;
    const nodeWithHelpers: FlattenedNode = { ...node, deepness, parents };

    if (!nodeHasChildren(node) || !isNodeExpanded(node)) {
      return [...flattenedTree, nodeWithHelpers];
    }

    return [
      ...flattenedTree,
      nodeWithHelpers,
      ...getFlattenedTree(node.children!, [...parents, node.id]),
    ];
  }, []);

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
