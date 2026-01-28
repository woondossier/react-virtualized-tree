import React, { Component } from 'react';
import classNames from 'classnames';

import Tree from '../../../src/TreeContainer';
import { Nodes } from '../../../testData/sampleTree';
import type { FlattenedNode, RendererProps } from '../../../src';

interface DeepnessProps {
  node: FlattenedNode;
  children?: React.ReactNode;
}

const Deepness: React.FC<DeepnessProps> = ({ node, children }) => {
  const deepness = node.deepness + 1;
  const className = classNames({
    [`mi mi-filter-${deepness}`]: deepness <= 9,
    'filter-9-plus': deepness > 9,
  });

  return (
    <span>
      <i className={className} />
      {children}
    </span>
  );
};

class Renderers extends Component {
  render() {
    return (
      <Tree nodes={Nodes}>
        {({ style, node, ...rest }: RendererProps) => (
          <div style={style}>
            <Deepness node={node} {...rest}>
              {node.name}
            </Deepness>
          </div>
        )}
      </Tree>
    );
  }
}

export default Renderers;
