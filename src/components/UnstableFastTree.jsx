import React from 'react';
import PropTypes from 'prop-types';

import Tree from './Tree.jsx';
import TreeStateModifiers from '../state/TreeStateModifiers.js';
import { UPDATE_TYPE } from '../constants.js';
import { Node } from '../shapes/nodeShapes';

export default class UnstableFastTree extends React.Component {
    static contextTypes = {
        unfilteredNodes: PropTypes.arrayOf(PropTypes.shape(Node)),
    };

    get nodes() {
        return this.context.unfilteredNodes || this.props.nodes;
    }

    handleChange = ({ node, type, index }) => {
        const { nodes } = this.props;

        let updatedState;
        if (type === UPDATE_TYPE.UPDATE) {
            updatedState = TreeStateModifiers.editNodeAt(nodes, index, node);
        } else {
            updatedState = TreeStateModifiers.deleteNodeAt(nodes, index);
        }

        this.props.onChange(updatedState);
    };

    render() {
        return (
            <Tree
                nodeMarginLeft={this.props.nodeMarginLeft}
                nodes={this.props.nodes.flattenedTree}
                onChange={this.handleChange}
                NodeRenderer={this.props.children}
                width={this.props.width}
                scrollToIndex={this.props.scrollToIndex}
                scrollToAlignment={this.props.scrollToAlignment}
            />
        );
    }
}

UnstableFastTree.propTypes = {
    nodes: PropTypes.shape({
        flattenedTree: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
        ).isRequired,
        tree: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    nodeMarginLeft: PropTypes.number,
    width: PropTypes.number,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.string,
};

UnstableFastTree.defaultProps = {
    nodeMarginLeft: 30,
};
