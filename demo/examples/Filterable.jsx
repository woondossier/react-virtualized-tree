import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';

import Tree from '../../src/components/TreeContainer.jsx';
import * as Renderers from '../../src/components/renderers';
import Favorite from '../../src/components/renderers/Favorite.jsx';
import FilteringContainer from '../../src/components/FilteringContainer.jsx';

import { createEntry, constructTree } from '../toolbelt';

const { Expandable } = Renderers;

const MAX_DEEPNESS = 3;
const MAX_NUMBER_OF_CHILDREN = 4;
const MIN_NUMBER_OF_PARENTS = 5;

const Nodes = constructTree(MAX_DEEPNESS, MAX_NUMBER_OF_CHILDREN, MIN_NUMBER_OF_PARENTS);

const EXPANDED = 'EXPANDED';

class Filterable extends Component {
    state = {
        nodes: Nodes,
        selectedGroup: EXPANDED,
        groupsEnabled: true,
    };

    getGroupProps() {
        const { groupsEnabled, selectedGroup } = this.state;

        if (!groupsEnabled) return {};

        return {
            groups: {
                ALL: {
                    name: 'All',
                    filter: () => true,
                },
                [EXPANDED]: {
                    name: 'Expanded',
                    filter: (node) => node.state?.expanded,
                },
                FAVORITES: {
                    name: 'Favorites',
                    filter: (node) => node.state?.favorite,
                },
            },
            selectedGroup,
            onSelectedGroupChange: this.handleSelectedGroupChange,
        };
    }

    handleChange = (nodes) => {
        this.setState({ nodes });
    };

    handleSelectedGroupChange = (selectedGroup) => {
        this.setState({ selectedGroup });
    };

    handleGroupsToggle = () => {
        this.setState((prev) => ({
            groupsEnabled: !prev.groupsEnabled,
        }));
    };

    render() {
        const { groupsEnabled, nodes } = this.state;

        return (
            <div>
                <Checkbox
                    toggle
                    label="Use groups"
                    checked={groupsEnabled}
                    onChange={this.handleGroupsToggle}
                    style={{ marginBottom: 15 }}
                />

                <FilteringContNainer nodes={nodes} {...this.getGroupProps()}>
                    {({ nodes }) => (
                        <div style={{ height: 500 }}>
                            <Tree nodes={nodes} onChange={this.handleChange}>
                                {({ style, node, ...rest }) => (
                                    <div style={style}>
                                        <Expandable node={node} {...rest}>
                                            <Favorite node={node} {...rest}>
                                                {node.name}
                                            </Favorite>
                                        </Expandable>
                                    </div>
                                )}
                            </Tree>
                        </div>
                    )}
                </FilteringContNainer>
            </div>
        );
    }
}

const FilterableEntry= createEntry(
    'filterable',
    'Filterable',
    'Filterable tree',
    <div>
        <p>Filtering is helpful when dealing with large data sets in the tree.</p>
        <p>
            By wrapping your <code>Tree</code> with <code>FilteringContainer</code>, it will only receive nodes that match
            the current filter/group.
        </p>
    </div>,
    Filterable
);

export default FilterableEntry;