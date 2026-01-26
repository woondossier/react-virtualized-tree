import React, {Component} from 'react';

import UnstableFastTree from '../../../src/UnstableFastTree.jsx';
import Renderers from '../../../src/renderers';
import {initialTreeState} from './largeCollectionData.js';

const {Deletable, Expandable, Favorite} = Renderers;

class LargeCollection extends Component {
  state = {
    nodes: initialTreeState,
  };

  handleChange = nodes => {
    this.setState({nodes});
  };

  render() {
    return (
      <UnstableFastTree nodes={this.state.nodes} onChange={this.handleChange}>
        {({style, node, ...rest}) => (
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
