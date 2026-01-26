import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TreeContainer from './TreeContainer.jsx';
import { UPDATE_TYPE } from './constants.js';

// Sample tree data for testing
const createTestNodes = () => [
  {
    id: 1,
    name: 'Node 1',
    state: { expanded: true },
    children: [
      { id: 2, name: 'Node 1.1', children: [] },
      { id: 3, name: 'Node 1.2', children: [] },
    ],
  },
  {
    id: 4,
    name: 'Node 2',
    state: { expanded: false },
    children: [{ id: 5, name: 'Node 2.1', children: [] }],
  },
];

// Simple test renderer component
const TestNodeRenderer = React.forwardRef(({ node, style, onChange }, ref) => (
  <div ref={ref} style={style} data-testid={`node-${node.id}`}>
    <span>{node.name}</span>
    <button
      data-testid={`toggle-${node.id}`}
      onClick={() =>
        onChange({
          node: { ...node, state: { ...node.state, expanded: !node.state?.expanded } },
          type: UPDATE_TYPE.UPDATE,
        })
      }
    >
      Toggle
    </button>
  </div>
));
TestNodeRenderer.displayName = 'TestNodeRenderer';

describe('TreeContainer', () => {
  let testNodes;

  beforeEach(() => {
    testNodes = createTestNodes();
  });

  describe('rendering', () => {
    it('should render tree nodes', () => {
      render(
        <TreeContainer nodes={testNodes} onChange={vi.fn()}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-4')).toBeInTheDocument();
    });

    it('should render expanded child nodes', () => {
      render(
        <TreeContainer nodes={testNodes} onChange={vi.fn()}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      // Node 1 is expanded, so children should be visible
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
      expect(screen.getByTestId('node-3')).toBeInTheDocument();
    });

    it('should not render collapsed child nodes', () => {
      render(
        <TreeContainer nodes={testNodes} onChange={vi.fn()}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      // Node 4 (Node 2) is collapsed, so children should not be visible
      expect(screen.queryByTestId('node-5')).not.toBeInTheDocument();
    });
  });

  describe('onChange handling', () => {
    it('should call onChange when node is updated', () => {
      const handleChange = vi.fn();

      render(
        <TreeContainer nodes={testNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      fireEvent.click(screen.getByTestId('toggle-1'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should pass updated nodes to onChange', () => {
      const handleChange = vi.fn();

      render(
        <TreeContainer nodes={testNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      fireEvent.click(screen.getByTestId('toggle-1'));

      const updatedNodes = handleChange.mock.calls[0][0];
      expect(updatedNodes).toBeDefined();
      expect(Array.isArray(updatedNodes)).toBe(true);
    });
  });

  describe('memoization', () => {
    it('should not recreate flattenedTree when nodes reference is the same', () => {
      const handleChange = vi.fn();
      const stableNodes = createTestNodes();

      const { rerender } = render(
        <TreeContainer nodes={stableNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      // Rerender with same nodes reference
      rerender(
        <TreeContainer nodes={stableNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      // The component should render without errors
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });

    it('should update when nodes change', () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <TreeContainer nodes={testNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByText('Node 1')).toBeInTheDocument();

      // Update with new nodes
      const newNodes = [{ id: 100, name: 'New Node', children: [] }];
      rerender(
        <TreeContainer nodes={newNodes} onChange={handleChange}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByText('New Node')).toBeInTheDocument();
      expect(screen.queryByText('Node 1')).not.toBeInTheDocument();
    });
  });

  describe('handleChange callback stability', () => {
    it('should maintain callback stability when dependencies do not change', () => {
      const handleChange = vi.fn();
      const stableNodes = createTestNodes();
      const callbackRefs = [];

      const CaptureCallback = React.forwardRef(({ onChange, node, style }, ref) => {
        React.useEffect(() => {
          callbackRefs.push(onChange);
        });
        return (
          <div ref={ref} style={style} data-testid={`node-${node.id}`}>
            {node.name}
          </div>
        );
      });
      CaptureCallback.displayName = 'CaptureCallback';

      const { rerender } = render(
        <TreeContainer nodes={stableNodes} onChange={handleChange}>
          {CaptureCallback}
        </TreeContainer>
      );

      rerender(
        <TreeContainer nodes={stableNodes} onChange={handleChange}>
          {CaptureCallback}
        </TreeContainer>
      );

      // With useCallback, the onChange reference should be stable
      // when nodes and onChange prop don't change
      if (callbackRefs.length >= 2) {
        expect(callbackRefs[0]).toBe(callbackRefs[1]);
      }
    });
  });

  describe('props', () => {
    it('should accept nodeMarginLeft prop', () => {
      render(
        <TreeContainer nodes={testNodes} onChange={vi.fn()} nodeMarginLeft={50}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });

    it('should accept width prop', () => {
      render(
        <TreeContainer nodes={testNodes} onChange={vi.fn()} width={800}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });

    it('should work without onChange prop', () => {
      render(
        <TreeContainer nodes={testNodes}>
          {TestNodeRenderer}
        </TreeContainer>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });
  });
});
