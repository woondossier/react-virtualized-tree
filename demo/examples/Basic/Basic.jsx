import React, { Component } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { Grid, Header, Label, Icon, Segment } from 'semantic-ui-react';
import update from 'immutability-helper';

import Tree from '../../../src/components/TreeContainer.jsx';
import Renderers from '../../../src/components/renderers';
import { Nodes } from '../../../testData/sampleTree';
import { createEntry } from '../../toolbelt';
import RendererDragContainer from './RendererDragContainer';

const { Deletable, Expandable, Favorite } = Renderers;

const NodeNameRenderer = ({ node: { name }, children }) => (
    <span>
    {name}
      {children}
  </span>
);

class BasicTree extends Component {
  state = {
    nodes: Nodes,
    availableRenderers: [Expandable, Deletable, Favorite],
    selectedRenderers: [Expandable, NodeNameRenderer],
  };

  handleRendererMove = (dragIndex, hoverIndex) => {
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

  handleChange = (nodes) => {
    this.setState({ nodes });
  };

  renderNodeDisplay = (Display, props, children = []) => {
    if (typeof Display !== 'function') {
      console.warn('Invalid renderer:', Display);
      return null;
    }

    return React.createElement(Display, props, children);
  };

  createNodeRenderer = (stack = this.state.selectedRenderers, props) => {
    const [Renderer, ...rest] = stack;
    if (!Renderer) return null;

    if (!rest.length) return this.renderNodeDisplay(Renderer, props);
    return this.renderNodeDisplay(Renderer, props, this.createNodeRenderer(rest, props));
  };

  getRenderedComponentTree = () => {
    const jsxTree = reactElementToJSXString(
      this.createNodeRenderer(this.state.selectedRenderers, { node: { name: 'X', id: 0 } })
    );

    return jsxTree
      .split('>')
      .filter(Boolean)
      .map((line, i) => {
        const depth = this.state.selectedRenderers.length;
        const isClosingTag = i >= depth;
        const marginLeft = isClosingTag ? 10 * (depth - 2 - Math.abs(depth - i)) : 10 * i;
        return <div key={i} style={{ marginLeft }}>{line}</div>;
      });
  };

  handleRendererDeselection = (index) => () => {
    this.setState(({ selectedRenderers }) => ({
      selectedRenderers: [
        ...selectedRenderers.slice(0, index),
        ...selectedRenderers.slice(index + 1),
      ],
    }));
  };

  handleRendererSelection = (renderer) => () => {
    this.setState(({ selectedRenderers }) => ({
      selectedRenderers: [...selectedRenderers, renderer],
    }));
  };

  render() {
    const { availableRenderers, selectedRenderers, nodes } = this.state;
    const renderersAvailableForAdd = availableRenderers.filter(r => !selectedRenderers.includes(r));

    return (
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Header as="h4">Available Renderers</Header>
              <Label.Group color="blue">
                {renderersAvailableForAdd.map((Renderer, i) => (
                    <Label as="a" key={i}>
                      {Renderer.name}
                      <Icon
                          name="plus"
                          onClick={this.handleRendererSelection(Renderer)}
                          style={{ marginLeft: 3 }}
                      />
                    </Label>
                ))}
              </Label.Group>
            </Grid.Column>

            <Grid.Column>
              <Header as="h4">Output Tree</Header>
              <div style={{ height: 200 }}>
                <Tree nodes={nodes} onChange={this.handleChange}>
                  {({ style, ...props }) => (
                      <div style={style}>
                        {this.createNodeRenderer(this.state.selectedRenderers, props)}
                      </div>
                  )}
                </Tree>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Header as="h4">Node Renderer Builder</Header>
              <Label.Group color="blue">
                <RendererDragContainer
                    selectedRenderers={selectedRenderers}
                    moveRenderer={this.handleRendererMove}
                    handleRendererDeselection={this.handleRendererDeselection}
                />
              </Label.Group>
            </Grid.Column>

            <Grid.Column>
              <Header as="h4">JSX Preview</Header>
              {this.getRenderedComponentTree()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

const BasicTreeEntry = createEntry(
    'basic-tree',
    'Basic/Basic',
    'Basic Tree',
    <div>
      <p>
        A tree that enables favorite toggle, expansion, and deletion. This example uses only the default renderers.
      </p>
    </div>,
    BasicTree
);

export default BasicTreeEntry;
