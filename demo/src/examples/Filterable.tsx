import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';

import Tree from '../../../src/TreeContainer';
import renderers from '../../../src/renderers';
import { constructTree } from '../toolbelt';
import FilteringContainer from '../../../src/FilteringContainer';
import Favorite from '../../../src/renderers/Favorite';
import type { Node, RendererProps, Groups } from '../../../src';

const { Expandable } = renderers;

const MAX_DEEPNESS = 3;
const MAX_NUMBER_OF_CHILDREN = 4;
const MIN_NUMBER_OF_PARENTS = 5;

const Nodes = constructTree(MAX_DEEPNESS, MAX_NUMBER_OF_CHILDREN, MIN_NUMBER_OF_PARENTS);

const EXPANDED = 'EXPANDED';

interface FilterableState {
  nodes: Node[];
  selectedGroup: string;
  groupsEnabled: boolean;
}

class Filterable extends Component<object, FilterableState> {
  state: FilterableState = {
    nodes: Nodes,
    selectedGroup: EXPANDED,
    groupsEnabled: true,
  };

  get _groupProps() {
    return this.state.groupsEnabled
      ? {
          groups: {
            ALL: {
              name: 'All',
              filter: () => true,
            },
            [EXPANDED]: {
              name: 'Expanded',
              filter: (node: Node) => Boolean(node.state?.expanded),
            },
            FAVORITES: {
              name: 'Favorites',
              filter: (node: Node) => Boolean(node.state?.favorite),
            },
          } as Groups,
          selectedGroup: this.state.selectedGroup,
          onSelectedGroupChange: this.handleSelectedGroupChange,
        }
      : {};
  }

  handleChange = () => {
    // this.setState({nodes});
  };

  handleSelectedGroupChange = (selectedGroup: string) => {
    this.setState({ selectedGroup });
  };

  handleGroupsToggle = () => {
    this.setState({ groupsEnabled: !this.state.groupsEnabled });
  };

  render() {
    return (
      <div>
        <Checkbox
          toggle
          label="Use groups"
          checked={this.state.groupsEnabled}
          onChange={this.handleGroupsToggle}
          style={{ marginBottom: 15 }}
        />
        <FilteringContainer nodes={this.state.nodes} {...this._groupProps}>
          {({ nodes }) => (
            <div style={{ height: 500 }}>
              <Tree nodes={nodes} onChange={this.handleChange}>
                {({ style, node, ...rest }: RendererProps) => (
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
        </FilteringContainer>
      </div>
    );
  }
}

export default Filterable;
