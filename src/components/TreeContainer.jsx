import React from 'react';
import PropTypes from 'prop-types';
import { TreeContext } from '../context/TreeContext.js';

export default class TreeContainer extends React.Component {
    render() {
        const { children, treeState } = this.props;

        return (
            <TreeContext.Provider
                value={{
                    depth: 0,
                    parentNode: null,
                    treeState,
                }}
            >
                {children}
            </TreeContext.Provider>
        );
    }
}

TreeContainer.propTypes = {
    treeState: PropTypes.object.isRequired,
    children: PropTypes.node,
};