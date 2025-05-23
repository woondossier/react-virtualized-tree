import React, { Component } from 'react';
import FocusTrap from 'focus-trap-react';

import Tree from '../../src/components/TreeContainer.jsx';
import * as Renderers from '../../src/components/renderers';
import { Nodes } from '../../testData/sampleTree';
import { createEntry } from '../toolbelt';

const { Expandable, Favorite } = Renderers;

class KeyboardNavigation extends Component {
    state = {
        nodes: Nodes,
    };

    handleChange = (nodes) => {
        this.setState({ nodes });
    };

    nodeRenderer = ({ style, node, ...rest }) => (
        <div style={style} data-nodeid={rest['data-nodeid']}>
            <Expandable node={node} {...rest}>
                <Favorite node={node} {...rest}>
                    <span tabIndex={0}>{node.name}</span>
                </Favorite>
            </Expandable>
        </div>
    );

    render() {
        return (
            <FocusTrap>
                <Tree nodes={this.state.nodes} onChange={this.handleChange}>
                    {this.nodeRenderer}
                </Tree>
            </FocusTrap>
        );
    }
}

const KeyboardNavigationEntry = createEntry(
    'keyboard-nav',
    'KeyboardNavigation',
    'Keyboard navigation',
    <div>
        <p>This example demonstrates keyboard accessibility using <code>tabIndex</code> and <code>focus-trap-react</code>.</p>
    </div>,
    KeyboardNavigation
);

export default KeyboardNavigationEntry;
