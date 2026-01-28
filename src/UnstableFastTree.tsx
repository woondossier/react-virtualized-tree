import React, { useCallback, useContext, useRef, type ComponentType } from 'react';

import Tree from './Tree';
import TreeStateModifiers from './state/TreeStateModifiers';
import { UPDATE_TYPE } from './constants';
import { TreeContext } from './context/TreeContext';
import { State } from './state/TreeState';
import type { NodeAction, RendererProps } from './types';

interface UnstableFastTreeProps {
  nodes: State;
  onChange?: (state: State) => void;
  children: ComponentType<RendererProps>;
  nodeMarginLeft?: number;
}

const UnstableFastTree: React.FC<UnstableFastTreeProps> = ({
  nodes: propNodes,
  onChange,
  children,
  nodeMarginLeft = 30,
}) => {
  const { unfilteredNodes } = useContext(TreeContext);
  // Note: TreeContext is typed for Node[] but UnstableFastTree uses it with State
  // This is a known design limitation - the context serves dual purposes
  // TODO: Consider creating a separate FastTreeContext for better type safety
  const contextNodes = unfilteredNodes as unknown as State | null;
  const nodes: State = contextNodes ?? propNodes;

  // Use refs to avoid recreating handleChange when nodes/onChange change
  const nodesRef = useRef(nodes);
  const onChangeRef = useRef(onChange);
  nodesRef.current = nodes;
  onChangeRef.current = onChange;

  const handleChange = useCallback(({ node, type, index }: NodeAction) => {
    let nextTreeState: State;
    if (type === UPDATE_TYPE.UPDATE) {
      nextTreeState = TreeStateModifiers.editNodeAt(nodesRef.current, index!, node);
    } else {
      nextTreeState = TreeStateModifiers.deleteNodeAt(nodesRef.current, index!);
    }

    onChangeRef.current?.(nextTreeState);
  }, []);

  return (
    <Tree
      nodeMarginLeft={nodeMarginLeft}
      nodes={nodes}
      onChange={handleChange}
      NodeRenderer={children}
    />
  );
};

export default UnstableFastTree;
