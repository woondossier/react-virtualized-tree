import React, { Component } from 'react';
import classNames from 'classnames';

import Tree from '../../../src/TreeContainer';
import renderers from '../../../src/renderers';
import { Nodes } from '../../../testData/sampleTree';
import type { Node, FlattenedNode, RendererProps, NodeAction } from '../../../src/types';

const { Expandable } = renderers;

const SELECT = 3;

interface SelectionProps {
  node: FlattenedNode;
  children?: React.ReactNode;
  onChange: (action: NodeAction) => void;
}

const Selection: React.FC<SelectionProps> = ({ node, children, onChange }) => {
  const { state: { selected } = {} } = node as FlattenedNode & { state?: { selected?: boolean } };
  const className = classNames({
    'mi mi-check-box': selected,
    'mi mi-check-box-outline-blank': !selected,
  });

  return (
    <span>
      <i
        className={className}
        onClick={() =>
          onChange({
            node: {
              ...node,
              state: {
                ...(node.state || {}),
                selected: !selected,
              },
            },
            type: SELECT,
          })
        }
      />
      {children}
    </span>
  );
};

interface ExtensionsState {
  nodes: Node[];
}

class Extensions extends Component<object, ExtensionsState> {
  state: ExtensionsState = {
    nodes: Nodes,
  };

  handleChange = (nodes: Node[]) => {
    this.setState({ nodes });
  };

  selectNodes = (nodes: Node[], selected: boolean): Node[] =>
    nodes.map((n) => ({
      ...n,
      children: n.children ? this.selectNodes(n.children, selected) : [],
      state: {
        ...n.state,
        selected,
      },
    }));

  nodeSelectionHandler = (nodes: Node[], updatedNode: FlattenedNode): Node[] =>
    nodes.map((node) => {
      if (node.id === updatedNode.id) {
        const selected = (updatedNode.state as { selected?: boolean })?.selected;
        return {
          ...updatedNode,
          children: node.children ? this.selectNodes(node.children, Boolean(selected)) : [],
        };
      }

      if (node.children) {
        return { ...node, children: this.nodeSelectionHandler(node.children, updatedNode) };
      }

      return node;
    });

  render() {
    return (
      <Tree
        nodes={this.state.nodes}
        onChange={this.handleChange}
        extensions={{
          updateTypeHandlers: {
            [SELECT]: this.nodeSelectionHandler,
          },
        }}
      >
        {({ style, node, ...rest }: RendererProps) => (
          <div style={style}>
            <Expandable node={node} {...rest}>
              <Selection node={node} {...rest}>
                {node.name}
              </Selection>
            </Expandable>
          </div>
        )}
      </Tree>
    );
  }
}

export default Extensions;
