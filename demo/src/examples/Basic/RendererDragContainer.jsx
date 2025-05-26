import React, {Component} from 'react';
import DraggableRenderer from './DraggableRenderer.jsx';

const style = {
  width: 400,
};

class RendererDragContainer extends Component {
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
