import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Label, Icon } from 'semantic-ui-react';

const style = {
  marginBottom: '.5rem',
  cursor: 'move',
  width: '50%',
};

const RendererCard = ({ id, index, renderer, moveRenderer, handleRendererDeselection }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.RENDERER,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveRenderer(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RENDERER,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const isNodeName = renderer.name === 'NodeNameRenderer';
  const name = isNodeName ? 'Node Name' : renderer.name;

  return (
    <div ref={ref} style={{ ...style, opacity: isDragging ? 0 : 1 }} data-handler-id={handlerId}>
      <Label as="a" tag={isNodeName}>
        {name}
        {!isNodeName && (
          <Icon name="close" onClick={handleRendererDeselection(id)} />
        )}
      </Label>
    </div>
  );
};

RendererCard.propTypes = {
  id: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  renderer: PropTypes.object.isRequired,
  moveRenderer: PropTypes.func.isRequired,
  handleRendererDeselection: PropTypes.func.isRequired,
};

export default RendererCard;
