import React, { useRef, useCallback, useMemo, type CSSProperties } from 'react';
import {
  AutoSizer,
  List,
  CellMeasurerCache,
  CellMeasurer,
  type ListRowRenderer,
} from 'react-virtualized';

import TreeState, { State } from './state/TreeState';
import type { TreeProps, FlattenedNode, NodeAction, RendererProps } from './types';

interface RowRendererParams {
  node: FlattenedNode;
  key: string | number;
  measure: () => void;
  registerChild?: ((element: Element | null) => void) | undefined;
  style: CSSProperties;
  index: number;
}

const Tree: React.FC<TreeProps> = ({
  nodes,
  NodeRenderer,
  onChange,
  nodeMarginLeft = 30,
  width,
  scrollToIndex,
  scrollToAlignment,
}) => {
  // Use useMemo to ensure cache is created once and always available
  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 20,
      }),
    []
  );
  const listRef = useRef<List | null>(null);

  const getRowCount = useCallback((): number => {
    return nodes instanceof State ? nodes.flattenedTree.length : (nodes as FlattenedNode[]).length;
  }, [nodes]);

  const getNodeDeepness = useCallback(
    (node: FlattenedNode, index: number): number => {
      if (nodes instanceof State) {
        return TreeState.getNodeDeepness(nodes, index);
      }
      return node.deepness;
    },
    [nodes]
  );

  const getNode = useCallback(
    (index: number): FlattenedNode => {
      if (nodes instanceof State) {
        const node = TreeState.getNodeAt(nodes, index);
        return { ...node, deepness: getNodeDeepness({} as FlattenedNode, index), parents: [] };
      }
      return (nodes as FlattenedNode[])[index];
    },
    [nodes, getNodeDeepness]
  );

  const rowRenderer = useCallback(
    ({ node, key, measure, registerChild, style, index }: RowRendererParams) => {
      const NodeComponent = NodeRenderer as React.ComponentType<RendererProps & { ref?: React.Ref<HTMLElement> }>;
      return (
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
          onChange={onChange}
          measure={measure}
          index={index}
        />
      );
    },
    [NodeRenderer, nodeMarginLeft, onChange]
  );

  const measureRowRenderer: ListRowRenderer = useCallback(
    ({ key, index, style, parent }) => {
      const node = getNode(index);

      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          rowIndex={index}
          parent={parent}
        >
          {({ measure, registerChild }) =>
            rowRenderer({ measure, registerChild, index, node, key, style })
          }
        </CellMeasurer>
      );
    },
    [getNode, rowRenderer]
  );

  const rowCount = useMemo(() => getRowCount(), [getRowCount]);

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
