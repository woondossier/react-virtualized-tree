import {
    getFlattenedTreePaths,
    doesChangeAffectFlattenedTree,
    isNodeExpanded,
    nodeHasChildren,
} from '../selectors/getFlattenedTree';

import TreeState, { State } from './TreeState';
import {
    replaceNodeFromTree,
    deleteNodeFromTree,
} from '../selectors/nodes';

/**
 * Tree state mutation helpers based on visible row index.
 */
export default class TreeStateModifiers {
    /**
     * Updates a node at the given visible row index using a patch or updater function.
     *
     * @param {State} state
     * @param {number} index
     * @param {Function|Object} nodeUpdate - Either a new node object or a function to mutate it
     * @returns {State}
     */
    static editNodeAt = (state, index, nodeUpdate) => {
        const originalNode = TreeState.getNodeAt(state, index);
        const updatedNode =
            typeof nodeUpdate === 'function' ? nodeUpdate(originalNode) : nodeUpdate;

        const flattenedTree = [...state.flattenedTree];
        const path = flattenedTree[index];
        const parents = path.slice(0, path.length - 1);

        if (doesChangeAffectFlattenedTree(originalNode, updatedNode)) {
            const visibleDescendants = TreeState.getNumberOfVisibleDescendants(state, index);

            if (isNodeExpanded(updatedNode)) {
                const subtree = getFlattenedTreePaths([updatedNode], parents);
                flattenedTree.splice(index + 1, 0, ...subtree.slice(1));
            } else {
                flattenedTree.splice(index + 1, visibleDescendants);
            }
        }

        const tree = replaceNodeFromTree(state.tree, { ...updatedNode, parents });

        return new State(tree, flattenedTree);
    };

    /**
     * Removes a node and all its visible descendants from the state.
     *
     * @param {State} state
     * @param {number} index
     * @returns {State}
     */
    static deleteNodeAt = (state, index) => {
        const node = TreeState.getNodeAt(state, index);
        const flattenedTree = [...state.flattenedTree];
        const path = flattenedTree[index];
        const parents = path.slice(0, path.length - 1);

        const visibleDescendants = nodeHasChildren(node)
            ? TreeState.getNumberOfVisibleDescendants(state, index)
            : 0;

        flattenedTree.splice(index, 1 + visibleDescendants);

        const tree = deleteNodeFromTree(state.tree, { ...node, parents });

        return new State(tree, flattenedTree);
    };
}
