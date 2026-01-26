import React, { Component, forwardRef } from 'react';

import Tree from '../../../src/TreeContainer';
import renderers from '../../../src/renderers';
import { getNodeRenderOptions } from '../../../src/selectors/nodes';
import type { Node, FlattenedNode, RendererProps } from '../../../src';

const { Expandable } = renderers;

const Nodes: Node[] = [
  {
    id: 'arg',
    name: 'Argentina',
    children: [
      {
        id: 'messi',
        name: 'Leo Messi',
        children: [{ id: 'messi-desc', name: '' }],
      },
      {
        id: 'maradona',
        name: 'Diego Maradona',
        children: [{ id: 'maradona-desc', name: '' }],
      },
    ],
  },
  {
    id: 'pt',
    name: 'Portugal',
    children: [
      {
        id: 'cr',
        name: 'Cristiano Ronaldo',
        children: [{ id: 'cr-desc', name: '' }],
      },
      {
        id: 'figo',
        name: 'Luis Figo',
        children: [{ id: 'figo-desc', name: '' }],
      },
    ],
  },
  {
    id: 'br',
    name: 'Brazil',
    children: [
      {
        id: 'r',
        name: 'Ronaldo',
        children: [{ id: 'r-desc', name: '' }],
      },
      {
        id: 'r10',
        name: 'Ronaldinho',
        children: [{ id: 'r10-desc', name: '' }],
      },
      {
        id: 'pele',
        name: 'Pele',
        children: [{ id: 'pele-desc', name: '' }],
      },
    ],
  },
  {
    id: 'fr',
    name: 'France',
    children: [
      {
        id: 'z',
        name: 'Zinedine Zidane',
        children: [{ id: 'z-desc', name: '' }],
      },
      {
        id: 'pl',
        name: 'Michel Platini',
        children: [{ id: 'pl-desc', name: '' }],
      },
    ],
  },
];

const DESCRIPTIONS: { [key: string]: string } = {
  fr: 'France is a country in Western Europe.',
  arg: 'Argentina is a country in South America.',
  pt: 'Portugal is a country in Southwestern Europe.',
  br: 'Brazil is the largest country in South America.',
  messi: 'Lionel Messi is an Argentine professional footballer.',
  maradona: 'Diego Maradona was an Argentine professional footballer.',
  cr: 'Cristiano Ronaldo is a Portuguese professional footballer.',
  figo: 'Luis Figo is a retired Portuguese footballer.',
  r: 'Ronaldo is a retired Brazilian professional footballer.',
  r10: 'Ronaldinho is a Brazilian former professional footballer.',
  pele: 'Pele is a Brazilian retired professional footballer.',
  z: 'Zinedine Zidane is a French retired professional footballer.',
  pl: 'Michel Platini is a French former football player.',
};

interface FootballPlayerRendererProps {
  node: FlattenedNode;
  children?: React.ReactNode;
  measure: () => void;
}

class FootballPlayerRenderer extends React.Component<FootballPlayerRendererProps> {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.props.measure();
    });
  }

  render() {
    const { node, children } = this.props;
    const { id, name } = node;
    const { isExpanded } = getNodeRenderOptions(node);

    return (
      <span>
        {children}
        <b>{name}</b>
        {isExpanded && <p>{DESCRIPTIONS[id as string]}</p>}
      </span>
    );
  }
}

interface NodeMeasureState {
  nodes: Node[];
}

class NodeMeasure extends Component<object, NodeMeasureState> {
  state: NodeMeasureState = {
    nodes: Nodes,
  };

  handleChange = (nodes: Node[]) => {
    this.setState({ nodes });
  };

  render() {
    return (
      <Tree nodes={this.state.nodes} onChange={this.handleChange}>
        {forwardRef<HTMLDivElement, RendererProps>(({ style, ...p }, ref) => (
          <div ref={ref} style={style}>
            <FootballPlayerRenderer {...p}>
              <Expandable {...p} />
            </FootballPlayerRenderer>
          </div>
        ))}
      </Tree>
    );
  }
}

export default NodeMeasure;
