import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TreeContext } from '../../context/TreeContext.js';

export default function Favorite({ node, onChange, style, children }) {
    const { treeState } = useContext(TreeContext);

    const toggleFavorite = e => {
        e.stopPropagation();
        const currentState = treeState.getNodeData(node.id).favorite;
        onChange(treeState.setNodeData(node.id, { favorite: !currentState }));
    };

    const isFavorite = treeState.getNodeData(node.id)?.favorite;

    return (
        <div style={style}>
            {children}
            <button onClick={toggleFavorite} style={{ marginLeft: 8 }}>
                {isFavorite ? '★' : '☆'}
            </button>
        </div>
    );
}

Favorite.propTypes = {
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    children: PropTypes.node,
};