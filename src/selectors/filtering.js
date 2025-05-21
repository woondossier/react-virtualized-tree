/**
 * Recursively filters a tree and returns:
 * - visible nodes matching the filter
 * - a mapping of node IDs to their parent paths
 *
 * @param {Function} filter - (node) => boolean
 * @param {Array} nodes - Tree nodes to filter
 * @param {Array} parents - Accumulated parent IDs
 * @returns {{ nodes: Array, nodeParentMappings: Object }}
 */
export const filterNodes = (filter, nodes, parents = []) => {
    const filtered = {
        nodes: [],
        nodeParentMappings: {},
    };

    for (const node of nodes) {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;

        let filteredChildren = [];
        let childMappings = {};

        if (hasChildren) {
            const result = filterNodes(filter, node.children, [...parents, node.id]);
            filteredChildren = result.nodes;
            childMappings = result.nodeParentMappings;
        }

        const shouldInclude = filter(node) || filteredChildren.length > 0;

        if (shouldInclude) {
            filtered.nodes.push({
                ...node,
                children: filteredChildren,
            });

            Object.assign(filtered.nodeParentMappings, childMappings, {
                [node.id]: parents,
            });
        }
    }

    return filtered;
};
