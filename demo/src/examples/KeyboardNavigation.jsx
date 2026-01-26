import React, {Component} from 'react';
import FocusTrap from 'focus-trap-react';
import Tree from '../../../src/TreeContainer.jsx';
import {Nodes} from '../../../testData/sampleTree';
import Renderers from '../../../src/renderers';

const {Expandable, Favorite} = Renderers;

class KeyboardNavigation extends Component {
  state = {
    nodes: Nodes,
    trapFocus: false,
  };

  handleChange = nodes => {
    this.setState({nodes});
  };

  nodeRenderer = ({style, node, ...rest}) => {
    return (
      <div style={style} data-nodeid={rest['data-nodeid']}>
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
