import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

import { FlattenedNode } from './shapes/nodeShapes';
import TreeState, { State } from './state/TreeState';

const Tree = ({
  nodes,
  NodeRenderer,
  onChange,
  nodeMarginLeft = 30,
  width,
  scrollToIndex,
  scrollToAlignment,
}) => {
  const cacheRef = useRef(null);
  const listRef = useRef(null);

  // Initialize cache only once
  if (!cacheRef.current) {
    cacheRef.current = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 20,
    });
  }

  const getRowCount = useCallback(() => {
    return nodes instanceof State ? nodes.flattenedTree.length : nodes.length;
  }, [nodes]);

  const getNodeDeepness = useCallback((node, index) => {
    if (nodes instanceof State) {
      return TreeState.getNodeDeepness(nodes, index);
    }
    return node.deepness;
  }, [nodes]);

  const getNode = useCallback((index) => {
    return nodes instanceof State
      ? { ...TreeState.getNodeAt(nodes, index), deepness: getNodeDeepness({}, index) }
      : nodes[index];
  }, [nodes, getNodeDeepness]);

  const rowRenderer = useCallback(({ node, key, measure, registerChild, style, index }) => {
    return (
      <NodeRenderer
        ref={registerChild}
        key={key}
        style={{
          ...style,
          marginLeft: node.deepness * nodeMarginLeft,
          userSelect: 'none',
          cursor: 'pointer',
        }}
        node={node}
        onChange={onChange}
        measure={measure}
        index={index}
      />
    );
  }, [NodeRenderer, nodeMarginLeft, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const measureRowRenderer = useCallback(({ key, index, style, parent }) => {
    const node = getNode(index);

    return (
      <CellMeasurer cache={cacheRef.current} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {(m) => rowRenderer({ ...m, index, node, key, style })}
      </CellMeasurer>
    );
  }, [getNode, rowRenderer]);

  const rowCount = useMemo(() => getRowCount(), [getRowCount]);

  return (
    <AutoSizer disableWidth={Boolean(width)}>
      {({ height, width: autoWidth }) => (
        <List
          deferredMeasurementCache={cacheRef.current}
          ref={listRef}
          height={height}
          rowCount={rowCount}
          rowHeight={cacheRef.current.rowHeight}
          rowRenderer={measureRowRenderer}
          width={width || autoWidth}
          scrollToIndex={scrollToIndex}
          scrollToAlignment={scrollToAlignment}
        />
      )}
    </AutoSizer>
  );
};

Tree.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape(FlattenedNode)).isRequired,
  NodeRenderer: PropTypes.elementType.isRequired,
  onChange: PropTypes.func.isRequired,
  nodeMarginLeft: PropTypes.number,
  width: PropTypes.number,
  scrollToIndex: PropTypes.number,
  scrollToAlignment: PropTypes.string,
};

export default Tree;
