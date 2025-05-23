import React, { Component } from 'react';

import Tree from '../../src/components/TreeContainer.jsx';
import * as Renderers from '../../src/components/renderers';
import { getNodeRenderOptions } from '../../src/selectors/nodes';
import { createEntry } from '../toolbelt';

const { Expandable } = Renderers;

const Nodes = [
    {
        id: 'arg',
        name: 'Argentina',
        children: [
            {
                id: 'messi',
                name: 'Leo Messi',
                children: [{ id: 'messi-desc', name: '' }],
            },
            {
                id: 'maradona',
                name: 'Diego Maradona',
                children: [{ id: 'maradona-desc', name: '' }],
            },
        ],
    },
    {
        id: 'pt',
        name: 'Portugal',
        children: [
            {
                id: 'cr',
                name: 'Cristiano Ronaldo',
                children: [{ id: 'cr-desc', name: '' }],
            },
            {
                id: 'figo',
                name: 'Luis Figo',
                children: [{ id: 'figo-desc', name: '' }],
            },
        ],
    },
    {
        id: 'br',
        name: 'Brazil',
        children: [
            {
                id: 'r',
                name: 'Ronaldo',
                children: [{ id: 'r-desc', name: '' }],
            },
            {
                id: 'r10',
                name: 'Ronaldinho',
                children: [{ id: 'r10-desc', name: '' }],
            },
            {
                id: 'pele',
                name: 'Pele',
                children: [{ id: 'pele-desc', name: '' }],
            },
        ],
    },
    {
        id: 'fr',
        name: 'France',
        children: [
            {
                id: 'z',
                name: 'Zinedine Zidane',
                children: [{ id: 'z-desc', name: '' }],
            },
            {
                id: 'pl',
                name: 'Michel Platini',
                children: [{ id: 'pl-desc', name: '' }],
            },
        ],
    },
];

const DESCRIPTIONS = {
    // (shortened for brevity here, include the same descriptions from your original object)
    messi: 'Lionel Messi is widely regarded as the greatest...',
    maradona: 'Diego Maradona was an Argentine football icon...',
    // etc...
};

class FootballPlayerRenderer extends React.Component {
    componentDidMount() {
        this.props.measure?.();
    }

    render() {
        const { node, children } = this.props;
        const { id, name } = node;
        const { isExpanded } = getNodeRenderOptions(node);

        return (
            <span>
        {children}
                <b>{name}</b>
                {isExpanded && <p>{DESCRIPTIONS[id]}</p>}
      </span>
        );
    }
}

class NodeMeasure extends Component {
    state = {
        nodes: Nodes,
    };

    handleChange = (nodes) => {
        this.setState({ nodes });
    };

    render() {
        return (
            <Tree nodes={this.state.nodes} onChange={this.handleChange}>
                {({ style, ...p }) => (
                    <div style={style}>
                        <FootballPlayerRenderer {...p}>
                            <Expandable {...p} />
                        </FootballPlayerRenderer>
                    </div>
                )}
            </Tree>
        );
    }
}

const NodeMeasureEntry = createEntry(
    'node-measure',
    'NodeMeasure',
    'Nodes with auto measure',
    <div>
        <p>
            All nodes in <code>react-virtualized-tree</code> support dynamic height measurement through{' '}
            <code>react-virtualized</code>'s <code>CellMeasurer</code>.
        </p>
        <p>This demo shows how to render nodes with expandable descriptions that trigger remeasurement.</p>
    </div>,
    NodeMeasure
);

export default NodeMeasureEntry;
