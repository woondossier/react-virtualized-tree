import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Tree from './Tree.jsx';
import { Node } from './shapes/nodeShapes';
import TreeStateModifiers from './state/TreeStateModifiers';
import { UPDATE_TYPE } from './constants.js';
import { TreeContext } from './context/TreeContext';

const UnstableFastTree = ({
                            nodes: propNodes,
                            onChange,
                            children,
                            nodeMarginLeft = 30,
                          }) => {
  const { unfilteredNodes } = useContext(TreeContext);
  const nodes = unfilteredNodes || propNodes;

  const handleChange = ({ node, type, index }) => {
    let nextTreeState;
    if (type === UPDATE_TYPE.UPDATE) {
      nextTreeState = TreeStateModifiers.editNodeAt(nodes, index, node);
    } else {
      nextTreeState = TreeStateModifiers.deleteNodeAt(nodes, index);
    }

    onChange?.(nextTreeState);
  };

  return (
      <Tree
          nodeMarginLeft={nodeMarginLeft}
          nodes={nodes}
          onChange={handleChange}
          NodeRenderer={children}
      />
  );
};

UnstableFastTree.propTypes = {
  nodes: PropTypes.shape({
    flattenedTree: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        )
    ).isRequired,
    tree: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
  }),
  onChange: PropTypes.func,
  children: PropTypes.func.isRequired,
  nodeMarginLeft: PropTypes.number,
};

export default UnstableFastTree;
