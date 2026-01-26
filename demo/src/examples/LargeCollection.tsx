import React, { Component } from 'react';

import UnstableFastTree from '../../../src/UnstableFastTree';
import renderers from '../../../src/renderers';
import { initialTreeState } from './largeCollectionData';
import { State } from '../../../src';
import type { RendererProps } from '../../../src';

const { Deletable, Expandable, Favorite } = renderers;

interface LargeCollectionState {
  nodes: State;
}

class LargeCollection extends Component<object, LargeCollectionState> {
  state: LargeCollectionState = {
    nodes: initialTreeState,
  };

  handleChange = (nodes: State) => {
    this.setState({ nodes });
  };

  render() {
    return (
      <UnstableFastTree nodes={this.state.nodes} onChange={this.handleChange}>
        {({ style, node, ...rest }: RendererProps) => (
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

export default LargeCollection;
