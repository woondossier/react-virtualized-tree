import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { createSelector } from 'reselect';

import Tree from './Tree';
import { UPDATE_TYPE } from './constants';
import { getFlattenedTree } from './selectors/getFlattenedTree';
import { deleteNodeFromTree, replaceNodeFromTree, getRowIndexFromId } from './selectors/nodes';
import { TreeContext } from './context/TreeContext';
import type {
  TreeContainerProps,
  Extensions,
  NodeAction,
  NodeId,
  UpdateTypeHandler,
} from './types';

const DEFAULT_UPDATE_TYPES: Record<number, UpdateTypeHandler> = {
  [UPDATE_TYPE.DELETE]: deleteNodeFromTree,
  [UPDATE_TYPE.UPDATE]: replaceNodeFromTree,
};

interface ResolvedExtensions {
  updateTypeHandlers: Record<number, UpdateTypeHandler>;
}

const getExtensions = createSelector(
  (e: Extensions | undefined) => e,
  (extensions: Extensions | undefined = {}): ResolvedExtensions => {
    const { updateTypeHandlers = {} } = extensions;

    return {
      updateTypeHandlers: {
        ...DEFAULT_UPDATE_TYPES,
        ...updateTypeHandlers,
      },
    };
  }
);

const TreeContainer: React.FC<TreeContainerProps> = ({
  nodes: propNodes,
  onChange,
  children,
  nodeMarginLeft = 30,
  width,
  scrollToId,
  scrollToAlignment,
  extensions,
  onScrollComplete,
}) => {
  const { unfilteredNodes } = useContext(TreeContext);
  const nodes = unfilteredNodes || propNodes;
  const lastScrollToIdRef = useRef<NodeId | null>(null);

  const { updateTypeHandlers } = getExtensions(extensions);

  // Use refs to avoid recreating handleChange when dependencies change
  const nodesRef = useRef(nodes);
  const onChangeRef = useRef(onChange);
  const updateTypeHandlersRef = useRef(updateTypeHandlers);
  nodesRef.current = nodes;
  onChangeRef.current = onChange;
  updateTypeHandlersRef.current = updateTypeHandlers;

  const handleChange = useCallback(
    ({ node, type }: NodeAction) => {
      const handler = updateTypeHandlersRef.current[type];
      if (!handler) {
        console.warn(`No handler for update type: ${type}`);
        return;
      }

      const updatedNodes = handler(nodesRef.current, node);
      if (onChangeRef.current) {
        onChangeRef.current(updatedNodes);
      }
    },
    []
  );

  const flattenedTree = getFlattenedTree(nodes);
  const shouldScroll = scrollToId != null && scrollToId !== lastScrollToIdRef.current;
  const rowIndex = shouldScroll ? getRowIndexFromId(flattenedTree, scrollToId) : -1;
  const scrollToIndex = shouldScroll && rowIndex > -1 ? rowIndex : undefined;

  useEffect(() => {
    if (scrollToId == null) {
      lastScrollToIdRef.current = null;
      return;
    }

    if (shouldScroll) {
      lastScrollToIdRef.current = scrollToId;
      onScrollComplete?.();
    }
  }, [scrollToId, shouldScroll, onScrollComplete]);

  return (
    <Tree
      nodeMarginLeft={nodeMarginLeft}
      nodes={flattenedTree}
      onChange={handleChange}
      NodeRenderer={children}
      scrollToIndex={scrollToIndex}
      scrollToAlignment={scrollToAlignment}
      width={width}
    />
  );
};

export default TreeContainer;
