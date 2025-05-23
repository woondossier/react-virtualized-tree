export const isNodeExpanded = (node) => node?.state?.expanded === true;

export const nodeHasChildren = (node) =>
    Array.isArray(node.children) && node.children.length > 0;

/**
 * Recursively flattens a tree into a linear list of visible nodes.
 * Mutates the `result` accumulator for efficiency.
 *
 * @param {Array} nodes - The root-level nodes
 * @param {Array} parents - The parent ID path (default: [])
 * @param {Array} result - Accumulator for flattened output (default: [])
 * @returns {Array} The flattened tree with helper metadata
 */
export const getFlattenedTree = (nodes, parents = [], result = []) => {
    for (const node of nodes) {
        const deepness = parents.length;
        const nodeWithHelpers = { ...node, deepness, parents };

        result.push(nodeWithHelpers);

        if (nodeHasChildren(node) && isNodeExpanded(node)) {
            getFlattenedTree(node.children, [...parents, node.id], result);
        }
    }

    return result;
};

/**
 * Recursively flattens a tree into a list of node ID paths.
 * Mutates the `result` accumulator for efficiency.
 *
 * @param {Array} nodes - The root-level nodes
 * @param {Array} parents - The parent ID path (default: [])
 * @param {Array} result - Accumulator for ID paths (default: [])
 * @returns {Array} Array of ID paths like [['a'], ['a','b'], ...]
 */
export const getFlattenedTreePaths = (nodes, parents = [], result = []) => {
    for (const node of nodes) {
        const path = [...parents, node.id];
        result.push(path);

        if (nodeHasChildren(node) && isNodeExpanded(node)) {
            getFlattenedTreePaths(node.children, path, result);
        }
    }

    return result;
};

/**
 * Determines if a node's expansion state has changed.
 *
 * @param {Object} previousNode
 * @param {Object} nextNode
 * @returns {boolean} Whether the expansion state differs
 */
export const doesChangeAffectFlattenedTree = (previousNode, nextNode) => {
    return isNodeExpanded(previousNode) !== isNodeExpanded(nextNode);
};
