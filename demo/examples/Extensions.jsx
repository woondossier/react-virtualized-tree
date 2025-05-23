import React, { Component } from 'react';
import classNames from 'classnames';

import Tree from '../../src/components/TreeContainer.jsx';
import * as Renderers from '../../src/components/renderers';
import { Nodes } from '../../testData/sampleTree';
import { createEntry } from '../toolbelt';

const { Expandable } = Renderers;

const SELECT = 3;

const Selection = ({ node, children, onChange }) => {
    const selected = node.state?.selected ?? false;

    const className = classNames({
        'mi mi-check-box': selected,
        'mi mi-check-box-outline-blank': !selected,
    });

    const toggleSelection = () => {
        onChange({
            node: {
                ...node,
                state: {
                    ...node.state,
                    selected: !selected,
                },
            },
            type: SELECT,
        });
    };

    return (
        <span>
      <i className={className} onClick={toggleSelection} />
            {children}
    </span>
    );
};

class Extensions extends Component {
    state = {
        nodes: Nodes,
    };

    handleChange = (nodes) => {
        this.setState({ nodes });
    };

    selectNodes = (nodes, selected) =>
        nodes.map((n) => ({
            ...n,
            children: n.children ? this.selectNodes(n.children, selected) : [],
            state: {
                ...n.state,
                selected,
            },
        }));

    nodeSelectionHandler = (nodes, updatedNode) =>
        nodes.map((node) => {
            if (node.id === updatedNode.id) {
                return {
                    ...updatedNode,
                    children: node.children
                        ? this.selectNodes(node.children, updatedNode.state.selected)
                        : [],
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: this.nodeSelectionHandler(node.children, updatedNode),
                };
            }

            return node;
        });

    render() {
        return (
            <Tree
                nodes={this.state.nodes}
                onChange={this.handleChange}
                extensions={{
                    updateTypeHandlers: {
                        [SELECT]: this.nodeSelectionHandler,
                    },
                }}
            >
                {({ style, node, ...rest }) => (
                    <div style={style}>
                        <Expandable node={node} {...rest}>
                            <Selection node={node} {...rest}>
                                {node.name}
                            </Selection>
                        </Expandable>
                    </div>
                )}
            </Tree>
        );
    }
}

const ExtensionEntry = createEntry(
    'extensions',
    'Extensions',
    'Extending behaviour',
    <div>
        <p>
            This example shows how to create a custom extension handler that selects all child nodes when a parent node is
            selected.
        </p>
        <p>
            By injecting the <code>extensions</code> prop with an <code>updateTypeHandler</code>, new behaviors can be added
            to the tree.
        </p>
    </div>,
    Extensions
);
export default ExtensionEntry;
