import React from 'react';
import PropTypes from 'prop-types';

import Tree from './Tree.jsx';
import TreeState from '../state/TreeState.js';

export default class TreeContainer extends React.Component {
    constructor(props) {
        super(props);

        const treeState = TreeState.createFromTree(props.nodes);
        this.state = {
            treeState,
        };
    }

    handleChange = (change) => {
        const { onChange, extensions } = this.props;

        const updatedTree = change.type && extensions?.updateTypeHandlers?.[change.type]
            ? extensions.updateTypeHandlers[change.type](this.state.treeState.tree, change.node)
            : change;

        const nextTreeState = TreeState.createFromTree(updatedTree);

        this.setState({ treeState: nextTreeState });

        if (onChange) {
            onChange(nextTreeState.tree);
        }
    };

    render() {
        const { treeState } = this.state;
        const { children, NodeRenderer, nodeMarginLeft, width, scrollToIndex, scrollToAlignment } = this.props;

        return (
            <Tree
                nodes={treeState.tree}
                onChange={this.handleChange}
                NodeRenderer={NodeRenderer || children}
                nodeMarginLeft={nodeMarginLeft}
                width={width}
                scrollToIndex={scrollToIndex}
                scrollToAlignment={scrollToAlignment}
            />
        );
    }
}

TreeContainer.propTypes = {
    nodes: PropTypes.array.isRequired,
    children: PropTypes.func,
    NodeRenderer: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    nodeMarginLeft: PropTypes.number,
    width: PropTypes.number,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.string,
    extensions: PropTypes.shape({
        updateTypeHandlers: PropTypes.object,
    }),
};
