import React, { Component, type ComponentType } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { Grid, Header, Label, Icon } from 'semantic-ui-react';
import update from 'immutability-helper';

import Tree from '../../../../src/TreeContainer';
import renderers from '../../../../src/renderers';
import { Nodes } from '../../../../testData/sampleTree';
import RendererDragContainer from './RendererDragContainer';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import type { Node, FlattenedNode, RendererProps } from '../../../../src';

const { Deletable, Expandable, Favorite } = renderers;

interface NodeNameRendererProps {
  node: FlattenedNode;
  children?: React.ReactNode;
}

const NodeNameRenderer: React.FC<NodeNameRendererProps> = ({ node: { name }, children }) => (
  <span>
    {name}
    {children}
  </span>
);

// Dynamic renderer composition requires flexible types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DynamicRenderer = ComponentType<any>;

interface BasicTreeState {
  nodes: Node[];
  availableRenderers: ComponentType<RendererProps>[];
  selectedRenderers: DynamicRenderer[];
}

class BasicTree extends Component<object, BasicTreeState> {
  state: BasicTreeState = {
    nodes: Nodes,
    availableRenderers: [Expandable, Deletable, Favorite],
    selectedRenderers: [Expandable, NodeNameRenderer as DynamicRenderer],
  };

  handleRendererMove = (dragIndex: number, hoverIndex: number) => {
    const { selectedRenderers } = this.state;
    const dragCard = selectedRenderers[dragIndex];

    this.setState(
      update(this.state, {
        selectedRenderers: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        },
      })
    );
  };

  handleChange = (nodes: Node[]) => {
    this.setState({ nodes });
  };

  renderNodeDisplay = (
    display: DynamicRenderer,
    props: Record<string, unknown>,
    children: React.ReactNode = null
  ): React.ReactElement => React.createElement(display, props, children);

  createNodeRenderer = (
    nodeDisplay: DynamicRenderer[] = this.state.selectedRenderers,
    props: Record<string, unknown>
  ): React.ReactElement => {
    const [nextNode, ...remainingNodes] = nodeDisplay;

    if (remainingNodes.length === 0) {
      return this.renderNodeDisplay(nextNode, props);
    }

    return this.renderNodeDisplay(nextNode, props, this.createNodeRenderer(remainingNodes, props));
  };

  getRenderedComponentTree = () =>
    reactElementToJSXString(
      this.createNodeRenderer(this.state.selectedRenderers, { node: { name: 'X', id: 0 } })
    )
      .split('>')
      .filter((c) => c)
      .map((c, i) => {
        const {
          selectedRenderers: { length },
        } = this.state;
        const isClosingTag = i >= length;

        const marginLeft = !isClosingTag ? 10 * i : 10 * (length - 2 - Math.abs(length - i));

        return (
          <div key={i} style={{ marginLeft }}>
            {c + '>'}
          </div>
        );
      });

  handleRendererDeselection = (i: number) => () => {
    this.setState(({ selectedRenderers }) => ({
      selectedRenderers: [...selectedRenderers.slice(0, i), ...selectedRenderers.slice(i + 1)],
    }));
  };

  handleRendererSelection = (renderer: DynamicRenderer) => () => {
    this.setState(({ selectedRenderers }) => ({
      selectedRenderers: [...selectedRenderers, renderer],
    }));
  };

  render() {
    const renderersAvailableForAdd = this.state.availableRenderers.filter(
      (r) => this.state.selectedRenderers.indexOf(r as DynamicRenderer) === -1
    );

    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">Available Renderers</Header>

            <Label.Group color="blue">
              {renderersAvailableForAdd.map((r) => {
                return (
                  <Label as="a" key={r.displayName || r.name}>
                    {r.displayName || r.name}
                    <Icon
                      name="plus"
                      onClick={this.handleRendererSelection(r as DynamicRenderer)}
                      style={{ marginLeft: 3 }}
                    />
                  </Label>
                );
              })}
            </Label.Group>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">Ouput tree</Header>
            <div style={{ height: 200 }}>
              <Tree nodes={this.state.nodes} onChange={this.handleChange}>
                {({ style, ...p }: RendererProps) => (
                  <div style={style}>{this.createNodeRenderer(this.state.selectedRenderers, p)}</div>
                )}
              </Tree>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h4">Node renderer builder</Header>

            <Label.Group color="blue">
              <DndProvider backend={HTML5Backend}>
                <RendererDragContainer
                  selectedRenderers={this.state.selectedRenderers}
                  moveRenderer={this.handleRendererMove}
                  handleRendererDeselection={this.handleRendererDeselection}
                />
              </DndProvider>
            </Label.Group>
          </Grid.Column>
          <Grid.Column>
            <Header as="h4">JSX</Header>

            {this.getRenderedComponentTree()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default BasicTree;
