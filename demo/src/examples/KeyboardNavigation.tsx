import React, { Component } from 'react';
import FocusTrap from 'focus-trap-react';
import Tree from '../../../src/TreeContainer';
import { Nodes } from '../../../testData/sampleTree';
import renderers from '../../../src/renderers';
import type { Node, RendererProps } from '../../../src';

const { Expandable, Favorite } = renderers;

interface KeyboardNavigationState {
  nodes: Node[];
  trapFocus: boolean;
}

class KeyboardNavigation extends Component<object, KeyboardNavigationState> {
  state: KeyboardNavigationState = {
    nodes: Nodes,
    trapFocus: false,
  };

  handleChange = (nodes: Node[]) => {
    this.setState({ nodes });
  };

  nodeRenderer = ({ style, node, ...rest }: RendererProps) => {
    return (
      <div style={style}>
        <Expandable node={node} {...rest}>
          <Favorite node={node} {...rest}>
            <span tabIndex={0}>{node.name}</span>
          </Favorite>
        </Expandable>
      </div>
    );
  };

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

export default KeyboardNavigation;
