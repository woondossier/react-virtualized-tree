import type { Node, NodeId, FilteredResult } from '../types';

const INITIAL_FILTERED_VALUE: FilteredResult = { nodes: [], nodeParentMappings: {} };

export const filterNodes = (
  filter: (node: Node) => boolean,
  nodes: Node[],
  parents: NodeId[] = []
): FilteredResult =>
  nodes.reduce<FilteredResult>((filtered, n) => {
    const { nodes: filteredChildren, nodeParentMappings: childrenNodeMappings } = n.children
      ? filterNodes(filter, n.children, [...parents, n.id])
      : INITIAL_FILTERED_VALUE;

    return !(filter(n) || filteredChildren.length)
      ? filtered
      : {
          nodes: [
            ...filtered.nodes,
            {
              ...n,
              children: filteredChildren,
            },
          ],
          nodeParentMappings: {
            ...filtered.nodeParentMappings,
            ...childrenNodeMappings,
            [n.id]: parents,
          },
        };
  }, INITIAL_FILTERED_VALUE);
