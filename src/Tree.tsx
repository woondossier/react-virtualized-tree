import React, { useRef, useCallback, useMemo } from 'react';
import {
  AutoSizer,
  List,
  CellMeasurerCache,
  CellMeasurer,
  type ListRowRenderer,
} from 'react-virtualized';

import TreeState, { State } from './state/TreeState';
import type { TreeProps, FlattenedNode, RendererProps } from './types';

const Tree: React.FC<TreeProps> = ({
  nodes,
  NodeRenderer,
  onChange,
  nodeMarginLeft = 30,
  width,
  scrollToIndex,
  scrollToAlignment,
}) => {
  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 20,
      }),
    []
  );
  const listRef = useRef<List | null>(null);

  // Use refs for values that change frequently but shouldn't cause re-renders
  const nodesRef = useRef(nodes);
  const onChangeRef = useRef(onChange);
  nodesRef.current = nodes;
  onChangeRef.current = onChange;

  const rowCount = nodes instanceof State ? nodes.flattenedTree.length : (nodes as FlattenedNode[]).length;

  const getNode = useCallback((index: number): FlattenedNode => {
    const currentNodes = nodesRef.current;
    if (currentNodes instanceof State) {
      const node = TreeState.getNodeAt(currentNodes, index);
      return { ...node, deepness: TreeState.getNodeDeepness(currentNodes, index), parents: [] };
    }
    return (currentNodes as FlattenedNode[])[index];
  }, []);

  const measureRowRenderer: ListRowRenderer = useCallback(
    ({ key, index, style, parent }) => {
      const node = getNode(index);
      const NodeComponent = NodeRenderer as React.ComponentType<RendererProps & { ref?: React.Ref<HTMLElement> }>;

      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          rowIndex={index}
          parent={parent}
        >
          {({ measure, registerChild }) => (
            <NodeComponent
              ref={registerChild as React.Ref<HTMLElement>}
              key={key}
              style={{
                ...style,
                marginLeft: node.deepness * nodeMarginLeft,
                userSelect: 'none',
                cursor: 'pointer',
              }}
              node={node}
              onChange={onChangeRef.current}
              measure={measure}
              index={index}
            />
          )}
        </CellMeasurer>
      );
    },
    [cache, getNode, NodeRenderer, nodeMarginLeft]
  );

  return (
    <AutoSizer disableWidth={Boolean(width)}>
      {({ height, width: autoWidth }) => (
        <List
          deferredMeasurementCache={cache}
          ref={listRef}
          height={height}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={measureRowRenderer}
          width={width || autoWidth}
          scrollToIndex={scrollToIndex}
          scrollToAlignment={scrollToAlignment as 'auto' | 'end' | 'start' | 'center' | undefined}
        />
      )}
    </AutoSizer>
  );
};

export default Tree;
