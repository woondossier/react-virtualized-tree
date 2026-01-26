import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import Tree from './Tree.jsx';
import { UPDATE_TYPE } from './constants.js';
import { getFlattenedTree } from './selectors/getFlattenedTree';
import {
  deleteNodeFromTree,
  replaceNodeFromTree,
  getRowIndexFromId,
} from './selectors/nodes';
import { Node } from './shapes/nodeShapes';
import { createSelector } from 'reselect';
import { TreeContext } from './context/TreeContext';

const DEFAULT_UPDATE_TYPES = {
  [UPDATE_TYPE.DELETE]: deleteNodeFromTree,
  [UPDATE_TYPE.UPDATE]: replaceNodeFromTree,
};

const getExtensions = createSelector(
  (e) => e,
  (extensions = {}) => {
    const { updateTypeHandlers = {} } = extensions;

    return {
      updateTypeHandlers: {
        ...DEFAULT_UPDATE_TYPES,
        ...updateTypeHandlers,
      },
    };
  }
);

const TreeContainer = ({
  nodes: propNodes,
  onChange,
  children,
  nodeMarginLeft = 30,
  width,
  scrollToId,
  scrollToAlignment,
  extensions,
}) => {
  const { unfilteredNodes } = useContext(TreeContext);
  const nodes = unfilteredNodes || propNodes;
  const lastScrollToIdRef = useRef(null);

  const { updateTypeHandlers } = getExtensions(extensions);

  const handleChange = useCallback(
    ({ node, type }) => {
      const handler = updateTypeHandlers[type];
      if (!handler) {
        console.warn(`No handler for update type: ${type}`);
        return;
      }

      const updatedNodes = handler(nodes, node);
      if (onChange) {
        onChange(updatedNodes);
      }
    },
    [nodes, onChange, updateTypeHandlers]
  );

  const flattenedTree = useMemo(() => getFlattenedTree(nodes), [nodes]);
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
    }
  }, [scrollToId, shouldScroll]);

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

TreeContainer.propTypes = {
  extensions: PropTypes.shape({
    updateTypeHandlers: PropTypes.object,
  }),
  nodes: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
  onChange: PropTypes.func,
  children: PropTypes.elementType.isRequired,
  nodeMarginLeft: PropTypes.number,
  width: PropTypes.number,
  scrollToId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scrollToAlignment: PropTypes.string,
};

export default TreeContainer;
