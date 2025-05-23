import React from 'react';
import PropTypes from 'prop-types';
import DraggableRenderer from './DraggableRenderer';

const style = {
  width: 400,
};

const RendererDragContainer = ({
                                 selectedRenderers,
                                 moveRenderer,
                                 handleRendererDeselection,
                               }) => {
  return (
    <div style={style}>
      {selectedRenderers.map((renderer, i) => (
        <DraggableRenderer
          key={renderer.name}
          index={i}
          id={i}
          renderer={renderer}
          moveRenderer={moveRenderer}
          handleRendererDeselection={handleRendererDeselection}
        />
      ))}
    </div>
  );
};

RendererDragContainer.propTypes = {
  selectedRenderers: PropTypes.array.isRequired,
  moveRenderer: PropTypes.func.isRequired,
  handleRendererDeselection: PropTypes.func.isRequired,
};

export default RendererDragContainer;
