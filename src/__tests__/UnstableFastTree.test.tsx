import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnstableFastTree from '../UnstableFastTree';
import TreeState, { State } from '../state/TreeState';
import { TreeContext } from '../context/TreeContext';
import { UPDATE_TYPE } from '../constants';
import type { RendererProps, Node, FlattenedNode } from '../types';

const sampleNodes: Node[] = [
  {
    id: 1,
    name: 'Node 1',
    state: { expanded: true },
    children: [{ id: 11, name: 'Node 1.1' }],
  },
  { id: 2, name: 'Node 2' },
];

const NodeRenderer: React.FC<RendererProps> = ({ node, style, onChange, index }) => (
  <div style={style} data-testid={`node-${node.id}`}>
    <span>{node.name}</span>
    <button
      data-testid={`update-${node.id}`}
      onClick={() =>
        onChange({
          type: UPDATE_TYPE.UPDATE,
          node: { ...node, name: `${node.name} Updated` } as FlattenedNode,
          index,
        })
      }
    >
      Update
    </button>
    <button
      data-testid={`delete-${node.id}`}
      onClick={() =>
        onChange({
          type: UPDATE_TYPE.DELETE,
          node: node as FlattenedNode,
          index,
        })
      }
    >
      Delete
    </button>
  </div>
);

describe('UnstableFastTree', () => {
  describe('rendering', () => {
    it('should render nodes from State', () => {
      const state = TreeState.createFromTree(sampleNodes);

      render(<UnstableFastTree nodes={state}>{NodeRenderer}</UnstableFastTree>);

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-11')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
    });

    it('should use custom nodeMarginLeft', () => {
      const state = TreeState.createFromTree(sampleNodes);

      render(
        <UnstableFastTree nodes={state} nodeMarginLeft={50}>
          {NodeRenderer}
        </UnstableFastTree>
      );

      const node = screen.getByTestId('node-11');
      // Child node should have margin based on deepness * nodeMarginLeft
      expect(node).toHaveStyle({ marginLeft: '50px' });
    });
  });

  describe('onChange handling', () => {
    it('should call onChange with updated state when node is updated', () => {
      const state = TreeState.createFromTree(sampleNodes);
      const onChange = vi.fn();

      render(
        <UnstableFastTree nodes={state} onChange={onChange}>
          {NodeRenderer}
        </UnstableFastTree>
      );

      fireEvent.click(screen.getByTestId('update-1'));

      expect(onChange).toHaveBeenCalledTimes(1);
      const newState = onChange.mock.calls[0][0] as State;
      expect(newState).toBeInstanceOf(State);
    });

    it('should call onChange with updated state when node is deleted', () => {
      const state = TreeState.createFromTree(sampleNodes);
      const onChange = vi.fn();

      render(
        <UnstableFastTree nodes={state} onChange={onChange}>
          {NodeRenderer}
        </UnstableFastTree>
      );

      fireEvent.click(screen.getByTestId('delete-2'));

      expect(onChange).toHaveBeenCalledTimes(1);
      const newState = onChange.mock.calls[0][0] as State;
      expect(newState).toBeInstanceOf(State);
    });

    it('should not throw if onChange is not provided', () => {
      const state = TreeState.createFromTree(sampleNodes);

      render(<UnstableFastTree nodes={state}>{NodeRenderer}</UnstableFastTree>);

      expect(() => {
        fireEvent.click(screen.getByTestId('update-1'));
      }).not.toThrow();
    });
  });

  describe('TreeContext integration', () => {
    it('should use nodes from TreeContext when available', () => {
      const propState = TreeState.createFromTree([{ id: 999, name: 'Prop Node' }]);
      const contextState = TreeState.createFromTree(sampleNodes);

      render(
        <TreeContext.Provider value={{ unfilteredNodes: contextState as unknown as Node[] }}>
          <UnstableFastTree nodes={propState}>{NodeRenderer}</UnstableFastTree>
        </TreeContext.Provider>
      );

      // Should render context nodes, not prop nodes
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.queryByTestId('node-999')).not.toBeInTheDocument();
    });

    it('should fall back to prop nodes when context is null', () => {
      const propState = TreeState.createFromTree(sampleNodes);

      render(
        <TreeContext.Provider value={{ unfilteredNodes: null }}>
          <UnstableFastTree nodes={propState}>{NodeRenderer}</UnstableFastTree>
        </TreeContext.Provider>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });
  });
});
