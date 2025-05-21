export const isNodeExpanded = node => node.state && node.state.expanded;

export const nodeHasChildren = node =>
    Array.isArray(node.children) && node.children.length > 0;

export const getFlattenedTree = (nodes, parents = []) =>
    nodes.reduce((flattenedTree, node) => {
        const deepness = parents.length;
        const nodeWithHelpers = { ...node, deepness, parents };

        if (!nodeHasChildren(node) || !isNodeExpanded(node)) {
            return [...flattenedTree, nodeWithHelpers];
        }

        return [
            ...flattenedTree,
            nodeWithHelpers,
            ...getFlattenedTree(node.children, [...parents, node.id]),
        ];
    }, []);

export const getFlattenedTreePaths = (nodes, parents = []) => {
    const paths = [];

    for (const node of nodes) {
        const { id } = node;
        const currentPath = [...parents, id];
        paths.push(currentPath);

        if (nodeHasChildren(node) && isNodeExpanded(node)) {
            paths.push(...getFlattenedTreePaths(node.children, currentPath));
        }
    }

    return paths;
};

export const doesChangeAffectFlattenedTree = (previousNode, nextNode) => {
    return isNodeExpanded(previousNode) !== isNodeExpanded(nextNode);
};
