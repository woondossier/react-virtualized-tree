import {
  getFlattenedTreePaths,
  doesChangeAffectFlattenedTree,
  isNodeExpanded,
  nodeHasChildren,
} from '../selectors/getFlattenedTree';
import TreeState, { State } from './TreeState';
import { replaceNodeFromTree, deleteNodeFromTree } from '../selectors/nodes';
import type { Node, FlattenedNode, NodePath } from '../types';

/**
 * Set of Tree State Modifiers
 */
export default class TreeStateModifiers {
  /**
   * Given a state, finds a node at a certain row index.
   * @param state - The current state
   * @param index - The visible row index
   * @param nodeUpdate - A function to update the node or the new node value
   * @return An internal state representation
   */
  static editNodeAt = (
    state: State,
    index: number,
    nodeUpdate: ((node: Node) => Node) | Node
  ): State => {
    const node = TreeState.getNodeAt(state, index);
    const updatedNode = typeof nodeUpdate === 'function' ? nodeUpdate(node) : nodeUpdate;
    const flattenedTree: NodePath[] = [...state.flattenedTree];
    const flattenedNodeMap = flattenedTree[index];
    const parents = flattenedNodeMap.slice(0, flattenedNodeMap.length - 1);

    if (doesChangeAffectFlattenedTree(node, updatedNode)) {
      const numberOfVisibleDescendants = TreeState.getNumberOfVisibleDescendants(state, index);

      if (isNodeExpanded(updatedNode)) {
        const updatedNodeSubTree = getFlattenedTreePaths([updatedNode], parents);

        flattenedTree.splice(index + 1, 0, ...updatedNodeSubTree.slice(1));
      } else {
        flattenedTree.splice(index + 1, numberOfVisibleDescendants);
      }
    }

    const flattenedUpdatedNode: FlattenedNode = {
      ...updatedNode,
      parents,
      deepness: parents.length,
    };

    const tree = replaceNodeFromTree(state.tree, flattenedUpdatedNode);

    return new State(tree, flattenedTree);
  };

  /**
   * Given a state, deletes a node
   * @param state - The current state
   * @param index - The visible row index
   * @return An internal state representation
   */
  static deleteNodeAt = (state: State, index: number): State => {
    const node = TreeState.getNodeAt(state, index);

    const flattenedTree: NodePath[] = [...state.flattenedTree];
    const flattenedNodeMap = flattenedTree[index];
    const parents = flattenedNodeMap.slice(0, flattenedNodeMap.length - 1);

    const numberOfVisibleDescendants = nodeHasChildren(node)
      ? TreeState.getNumberOfVisibleDescendants(state, index)
      : 0;

    flattenedTree.splice(index, 1 + numberOfVisibleDescendants);

    const flattenedNode: FlattenedNode = {
      ...node,
      parents,
      deepness: parents.length,
    };

    const tree = deleteNodeFromTree(state.tree, flattenedNode);

    return new State(tree, flattenedTree);
  };
}
