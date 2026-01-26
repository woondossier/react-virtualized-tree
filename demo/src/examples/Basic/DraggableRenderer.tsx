import React, { useRef, type ComponentType } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Label, Icon } from 'semantic-ui-react';
import ItemTypes from './ItemTypes';

const style = {
  marginBottom: '.5rem',
  cursor: 'move',
  width: '50%',
};

interface DragItem {
  id: number;
  index: number;
}

interface RendererCardProps {
  renderer: ComponentType<unknown>;
  id: number;
  index: number;
  moveRenderer: (dragIndex: number, hoverIndex: number) => void;
  handleRendererDeselection: (id: number) => () => void;
}

const RendererCard: React.FC<RendererCardProps> = ({
  renderer,
  id,
  index,
  moveRenderer,
  handleRendererDeselection,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.RENDERER,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, index]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.RENDERER,
      hover(item: DragItem, monitor) {
        if (!ref.current) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveRenderer(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    }),
    [index, moveRenderer]
  );

  drag(drop(ref));

  const isNodeName = renderer?.name === 'NodeNameRenderer';
  const name = isNodeName ? 'Node Name' : renderer?.name || 'Unnamed';

  return (
    <div ref={ref} style={{ ...style, opacity: isDragging ? 0 : 1 }}>
      <Label as="a" tag={isNodeName}>
        {name}
        {!isNodeName && <Icon name="close" onClick={handleRendererDeselection(id)} />}
      </Label>
    </div>
  );
};

export default RendererCard;
