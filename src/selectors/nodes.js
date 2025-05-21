import { createSelector } from 'reselect';
import omit from 'lodash.omit';
import findIndex from 'lodash.findindex';

import { UPDATE_TYPE } from '../constants'; // ✅ fixed typo

export { getFlattenedTree } from './getFlattenedTree';

/**
 * Derives renderer state flags from a node.
 */
export const getNodeRenderOptions = createSelector(
    node => node.state?.expanded,
    node => node.state?.favorite,
    node => node.state?.deletable,
    node => node.children,
    (expanded, favorite, deletable, children = []) => ({
        hasChildren: children.length > 0,
        isExpanded: !!expanded,
        isFavorite: !!favorite,
        isDeletable: !!deletable,
    })
);

const FLATTEN_TREE_PROPERTIES = ['deepness', 'parents'];

const NODE_OPERATION_TYPES = {
    CHANGE_NODE: 'CHANGE_NODE',
    DELETE_NODE: 'DELETE_NODE',
};

const NODE_CHANGE_OPERATIONS = {
    CHANGE_NODE: (nodes, updatedNode) =>
        nodes.map(n =>
            n.id === updatedNode.id
                ? omit(
                    {
                        ...updatedNode,
                        ...(n.children ? { children: [...n.children] } : {}),
                    },
                    FLATTEN_TREE_PROPERTIES
                )
                : n
        ),
    DELETE_NODE: (nodes, updatedNode) =>
        nodes.filter(n => n.id !== updatedNode.id),
};

/**
 * Recursively updates or deletes a node based on operation type.
 */
export const replaceNodeFromTree = (nodes, updatedNode, operation = NODE_OPERATION_TYPES.CHANGE_NODE) => {
    const op = NODE_CHANGE_OPERATIONS[operation];
    if (!op) return nodes;

    const { parents = [] } = updatedNode;

    if (parents.length === 0) {
        return op(nodes, updatedNode);
    }

    const parentIndex = findIndex(nodes, n => n.id === parents[0]);
    if (parentIndex === -1) return nodes;

    return [
        ...nodes.slice(0, parentIndex),
        {
            ...nodes[parentIndex],
            ...(nodes[parentIndex].children && {
                children: replaceNodeFromTree(
                    nodes[parentIndex].children,
                    { ...updatedNode, parents: parents.slice(1) },
                    operation
                ),
            }),
        },
        ...nodes.slice(parentIndex + 1),
    ];
};

export const deleteNodeFromTree = (nodes, deletedNode) =>
    replaceNodeFromTree(nodes, deletedNode, NODE_OPERATION_TYPES.DELETE_NODE);

/**
 * Creates a tree node update action.
 */
export const updateNode = (originalNode, newState) => ({
    node: {
        ...originalNode,
        state: {
            ...originalNode.state,
            ...newState,
        },
    },
    type: UPDATE_TYPE.UPDATE,
});

export const deleteNode = node => ({
    node,
    type: UPDATE_TYPE.DELETE,
});

export const addNode = node => ({
    node,
    type: UPDATE_TYPE.ADD,
});

/**
 * Finds the index of a node by ID in a flattened tree.
 */
export const getRowIndexFromId = (flattenedTree, id) =>
    findIndex(flattenedTree, node => node.id === id);

/**
 * Traverses the tree using a path of node IDs to return a specific node.
 *
 * @param {Array<string|number>} path - Array of node IDs
 * @param {Array<Object>} tree - Root-level node array
 * @returns {Object} - The resolved node
 */
export const getNodeFromPath = (path, tree) => {
    if (!Array.isArray(path)) {
        throw new Error('getNodeFromPath: path must be an array');
    }

    let node = null;
    let currentLevel = tree;

    for (let i = 0; i < path.length; i++) {
        const id = path[i];
        const found = currentLevel.find(n => n.id === id);

        if (!found) {
            throw new Error(`Node with id "${id}" not found at path: ${path.join(' > ')}`);
        }

        node = found;
        currentLevel = found.children || [];
    }

    return node;
};
