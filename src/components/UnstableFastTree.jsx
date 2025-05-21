import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TreeContext } from '../context/TreeContext';
import Tree from './Tree.jsx';

export default function UnstableFastTree(props) {
    const parentContext = useContext(TreeContext);
    const { treeState } = parentContext;

    return (
        <TreeContext.Provider
            value={{
                ...parentContext,
                treeState: treeState.recalculateVisibleNodes(),
            }}
        >
            <Tree {...props} />
        </TreeContext.Provider>
    );
}

UnstableFastTree.propTypes = {
    nodes: PropTypes.any,
    NodeRenderer: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    nodeMarginLeft: PropTypes.number,
    width: PropTypes.number,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.string,
};
