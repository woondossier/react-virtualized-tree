import React, { Component } from 'react';

import Tree from '../../../src/TreeContainer';
import renderers from '../../../src/renderers';
import { Nodes } from '../../../testData/sampleTree';
import type { Node, RendererProps } from '../../../src';

const { Expandable } = renderers;

interface ChangeRenderersState {
  nodes: Node[];
}

class ChangeRenderers extends Component<object, ChangeRenderersState> {
  state: ChangeRenderersState = {
    nodes: Nodes,
  };

  handleChange = (nodes: Node[]) => {
    this.setState({ nodes });
  };

  render() {
    return (
      <Tree nodes={this.state.nodes} onChange={this.handleChange}>
        {({ style, node, ...rest }: RendererProps) => (
          <div style={style}>
            <Expandable
              node={node}
              {...rest}
              iconsClassNameMap={{
                expanded: 'mi mi-folder-open',
                collapsed: 'mi mi-folder',
                lastChild: 'mi mi-insert-drive-file',
              }}
            >
              {node.name}
            </Expandable>
          </div>
        )}
      </Tree>
    );
  }
}

export default ChangeRenderers;
