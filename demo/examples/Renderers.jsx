import React, { Component } from 'react';
import classNames from 'classnames';

import Tree from '../../src/components/TreeContainer.jsx';
import { Nodes } from '../../testData/sampleTree';
import { createEntry } from '../toolbelt';

const Deepness = ({ node, children }) => {
    const deepness = (node.deepness ?? 0) + 1;
    const className = classNames({
        [`mi mi-filter-${deepness}`]: deepness <= 9,
        'filter-9-plus': deepness > 9,
    });

    return (
        <span>
      <i className={className} />
            {children}
    </span>
    );
};

class Renderers extends Component {
    render() {
        return (
            <Tree nodes={Nodes}>
                {({ style, node, ...rest }) => (
                    <div style={style}>
                        <Deepness node={node} {...rest}>{node.name}</Deepness>
                    </div>
                )}
            </Tree>
        );
    }
}

const RenderersEntry = createEntry(
    'renderers',
    'Renderers',
    'Create a custom renderer',
    <div>
        <p>This example shows how to build a custom node renderer based on tree depth.</p>
        <p>Each node gets an icon class like <code>mi mi-filter-1</code> to <code>mi mi-filter-9</code>.</p>
    </div>,
    Renderers
);

export default RenderersEntry;