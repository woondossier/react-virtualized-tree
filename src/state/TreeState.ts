import { getFlattenedTreePaths } from '../selectors/getFlattenedTree';
import { getNodeFromPath } from '../selectors/nodes';
import type { Node, NodeId, NodePath } from '../types';

export class State {
  flattenedTree: NodePath[];
  tree: Node[];

  constructor(tree: Node[], flattenedTree?: NodePath[]) {
    this.tree = tree;
    this.flattenedTree = flattenedTree || getFlattenedTreePaths(tree);
  }
}

export function validateState(state: unknown): asserts state is State {
  if (!(state instanceof State)) {
    throw new Error(`Expected a State instance but got ${typeof state}`);
  }
}

/**
 * Immutable structure that represents the TreeState.
 */
export default class TreeState {
  /**
   * Given a state, finds a node at a certain row index.
   * @param state - The current state
   * @param index - The visible row index
   * @return The node at the given index
   */
  static getNodeAt = (state: State, index: number): Node => {
    validateState(state);

    const rowPath = state.flattenedTree[index];

    if (!rowPath) {
      throw Error(
        `Tried to get node at row "${index}" but got nothing, the tree are ${state.flattenedTree.length} visible rows`
      );
    }

    return getNodeFromPath(rowPath, state.tree);
  };

  /**
   * Given a state, finds a node deepness at a certain row index.
   * @param state - The current state
   * @param index - The visible row index
   * @return The node deepness
   */
  static getNodeDeepness = (state: State, index: number): number => {
    validateState(state);

    const rowPath = state.flattenedTree[index];

    if (!rowPath) {
      throw Error(
        `Tried to get node at row "${index}" but got nothing, the tree are ${state.flattenedTree.length} visible rows`
      );
    }

    return rowPath.length - 1;
  };

  /**
   * Given a state and an index, finds the number of visible descendants
   * @param state - The current state
   * @param index - The visible row index
   * @return The number of visible descendants
   */
  static getNumberOfVisibleDescendants = (state: State, index: number): number => {
    const { id } = TreeState.getNodeAt(state, index);

    const { flattenedTree } = state;
    let i: number;

    for (i = index; i < flattenedTree.length; i++) {
      const path = flattenedTree[i];

      if (!path.some((p: NodeId) => p === id)) {
        break;
      }
    }

    return Math.max(i - 1 - index, 0);
  };

  /**
   * Given a state, gets the tree
   * @param state - The current state
   * @return The tree
   */
  static getTree = (state: State): Node[] => {
    validateState(state);

    return state.tree;
  };

  /**
   * Creates an instance of state.
   * @param tree - The original tree
   * @return An internal state representation
   */
  static createFromTree = (tree: Node[]): State => {
    if (!tree) {
      throw Error('A falsy tree was supplied in tree creation');
    }

    if (!Array.isArray(tree)) {
      throw Error('An invalid tree was supplied in creation');
    }

    return new State(tree);
  };
}
