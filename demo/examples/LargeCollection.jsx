import React, { Component } from 'react';

import UnstableFastTree from '../../src/components/UnstableFastTree.jsx';
import * as Renderers from '../../src/components/renderers';
import TreeState from '../../src/state/TreeState.js';
import { createEntry, constructTree } from '../toolbelt';

const { Deletable, Expandable, Favorite } = Renderers;

const MIN_NUMBER_OF_PARENTS = 500;
const MAX_NUMBER_OF_CHILDREN = 30;
const MAX_DEEPNESS = 4;

const Nodes = constructTree(MAX_DEEPNESS, MAX_NUMBER_OF_CHILDREN, MIN_NUMBER_OF_PARENTS);

const getTotalNumberOfElements = (nodes, counter = 0) =>
    counter + nodes.length + nodes.reduce((acc, n) => getTotalNumberOfElements(n.children, acc), 0);

const totalNumberOfNodes = getTotalNumberOfElements(Nodes);

class LargeCollection extends Component {
    state = {
        nodes: TreeState.createFromTree(Nodes),
    };

    handleChange = (updatedState) => {
        this.setState({ nodes: updatedState });
    };

    render() {
        return (
            <UnstableFastTree nodes={this.state.nodes} onChange={this.handleChange}>
                {({ style, node, ...rest }) => (
                    <div style={style}>
                        <Expandable node={node} {...rest}>
                            {node.name}
                            <Deletable node={node} {...rest}>
                                <Favorite node={node} {...rest} />
                            </Deletable>
                        </Expandable>
                    </div>
                )}
            </UnstableFastTree>
        );
    }
}

const LargeCollectionEntry = createEntry(
    'large-collection',
    'LargeCollection',
    'Large Data Collection',
    <div>
        <p>A tree that renders a large collection of nodes.</p>
        <p>This example is rendering a total of {totalNumberOfNodes} nodes.</p>
    </div>,
    LargeCollection
);

export default LargeCollectionEntry;
