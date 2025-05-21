import { getFlattenedTreePaths } from '../selectors/getFlattenedTree';
import { getNodeFromPath } from '../selectors/nodes';

/**
 * Immutable structure that represents the internal tree state:
 * - original tree (`tree`)
 * - visible node paths (`flattenedTree`)
 */
export class State {
    flattenedTree = null;
    tree = null;

    constructor(tree, flattenedTree) {
        this.tree = tree;
        this.flattenedTree = flattenedTree || getFlattenedTreePaths(tree);
    }
}

/**
 * Ensures the passed value is a valid State instance.
 */
export const validateState = (state) => {
    if (!(state instanceof State)) {
        throw new Error(`Expected a State instance, but got: ${typeof state}`);
    }
};

/**
 * Static methods to interact with and query a State object.
 */
export default class TreeState {
    /**
     * Retrieves the node at a given visible index in the flattened tree.
     */
    static getNodeAt = (state, index) => {
        validateState(state);

        const rowPath = state.flattenedTree[index];

        if (!rowPath) {
            throw new Error(
                `No node at row "${index}". The tree has ${state.flattenedTree.length} visible rows.`
            );
        }

        return getNodeFromPath(rowPath, state.tree);
    };

    /**
     * Retrieves the deepness (indent level) of a node at a given row.
     */
    static getNodeDeepness = (state, index) => {
        validateState(state);

        const rowPath = state.flattenedTree[index];

        if (!rowPath) {
            throw new Error(
                `No node at row "${index}". The tree has ${state.flattenedTree.length} visible rows.`
            );
        }

        return rowPath.length - 1;
    };

    /**
     * Calculates how many visible descendant rows appear after a node.
     */
    static getNumberOfVisibleDescendants = (state, index) => {
        const { id } = TreeState.getNodeAt(state, index);
        const { flattenedTree } = state;

        let i = index + 1;
        while (i < flattenedTree.length) {
            const path = flattenedTree[i];
            if (!path.includes(id)) break;
            i++;
        }

        return Math.max(i - 1 - index, 0);
    };

    /**
     * Retrieves the original tree structure.
     */
    static getTree = (state) => {
        validateState(state);
        return state.tree;
    };

    /**
     * Creates a new tree state from an array-based tree.
     */
    static createFromTree = (tree) => {
        if (!tree) {
            throw new Error('A falsy tree was supplied.');
        }

        if (!Array.isArray(tree)) {
            throw new Error('Expected tree to be an array.');
        }

        return new State(tree);
    };
}
