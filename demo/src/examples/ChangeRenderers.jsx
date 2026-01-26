import React, {Component} from 'react';

import Tree from '../../../src/TreeContainer.jsx';
import Renderers from '../../../src/renderers';
import {Nodes} from '../../../testData/sampleTree';

const {Expandable} = Renderers;

class ChangeRenderers extends Component {
  state = {
    nodes: Nodes,
  };

  handleChange = nodes => {
    this.setState({nodes});
  };

  render() {
    return (
      <Tree nodes={this.state.nodes} onChange={this.handleChange}>
        {({style, node, ...rest}) => (
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
