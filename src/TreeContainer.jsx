import React, { useContext } from 'react';
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

  const { updateTypeHandlers } = getExtensions(extensions);

  const handleChange = ({ node, type }) => {
    const handler = updateTypeHandlers[type];
    if (!handler) {
      console.warn(`No handler for update type: ${type}`);
      return;
    }

    const updatedNodes = handler(nodes, node);
    if (onChange) {
      onChange(updatedNodes);
    }
  };

  const flattenedTree = getFlattenedTree(nodes);
  const rowIndex = getRowIndexFromId(flattenedTree, scrollToId);

  return (
      <Tree
          nodeMarginLeft={nodeMarginLeft}
          nodes={flattenedTree}
          onChange={handleChange}
          NodeRenderer={children}
          scrollToIndex={rowIndex}
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
  children: PropTypes.func.isRequired,
  nodeMarginLeft: PropTypes.number,
  width: PropTypes.number,
  scrollToId: PropTypes.number,
  scrollToAlignment: PropTypes.string,
};

export default TreeContainer;
