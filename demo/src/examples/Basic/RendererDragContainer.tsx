import React, { Component, type ComponentType } from 'react';
import DraggableRenderer from './DraggableRenderer';

const style = {
  width: 400,
};

interface RendererDragContainerProps {
  selectedRenderers: ComponentType<unknown>[];
  moveRenderer: (dragIndex: number, hoverIndex: number) => void;
  handleRendererDeselection: (id: number) => () => void;
}

class RendererDragContainer extends Component<RendererDragContainerProps> {
  render() {
    return (
      <div style={style}>
        {this.props.selectedRenderers.map((card, i) => (
          <DraggableRenderer
            key={card.name}
            index={i}
            id={i}
            renderer={card}
            moveRenderer={this.props.moveRenderer}
            handleRendererDeselection={this.props.handleRendererDeselection}
          />
        ))}
      </div>
    );
  }
}

export default RendererDragContainer;
