import React from 'react';
import { render, screen } from '@testing-library/react';
import Tree from '../Tree';
import TreeState, { State } from '../state/TreeState';
import type { RendererProps, Node, FlattenedNode, NodeAction } from '../types';

const sampleNodes: Node[] = [
  {
    id: 1,
    name: 'Node 1',
    state: { expanded: true },
    children: [
      { id: 11, name: 'Node 1.1' },
      { id: 12, name: 'Node 1.2' },
    ],
  },
  { id: 2, name: 'Node 2' },
];

const flattenedNodes: FlattenedNode[] = [
  { id: 1, name: 'Node 1', deepness: 0, parents: [], state: { expanded: true } },
  { id: 11, name: 'Node 1.1', deepness: 1, parents: [1] },
  { id: 12, name: 'Node 1.2', deepness: 1, parents: [1] },
  { id: 2, name: 'Node 2', deepness: 0, parents: [] },
];

const NodeRenderer: React.FC<RendererProps> = ({ node, style }) => (
  <div style={style} data-testid={`node-${node.id}`} data-deepness={node.deepness}>
    {node.name}
  </div>
);

const mockOnChange = vi.fn();

describe('Tree', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('with FlattenedNode array', () => {
    it('should render all flattened nodes', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-11')).toBeInTheDocument();
      expect(screen.getByTestId('node-12')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
    });

    it('should apply margin based on node deepness', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
          nodeMarginLeft={20}
        />
      );

      const rootNode = screen.getByTestId('node-1');
      const childNode = screen.getByTestId('node-11');

      expect(rootNode).toHaveStyle({ marginLeft: '0px' });
      expect(childNode).toHaveStyle({ marginLeft: '20px' });
    });

    it('should use default nodeMarginLeft of 30', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      const childNode = screen.getByTestId('node-11');
      expect(childNode).toHaveStyle({ marginLeft: '30px' });
    });
  });

  describe('with State object', () => {
    it('should render nodes from State', () => {
      const state = TreeState.createFromTree(sampleNodes);

      render(
        <Tree
          nodes={state}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-11')).toBeInTheDocument();
      expect(screen.getByTestId('node-12')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
    });

    it('should calculate deepness from State', () => {
      const state = TreeState.createFromTree(sampleNodes);

      render(
        <Tree
          nodes={state}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
          nodeMarginLeft={25}
        />
      );

      const rootNode = screen.getByTestId('node-1');
      const childNode = screen.getByTestId('node-11');

      expect(rootNode).toHaveStyle({ marginLeft: '0px' });
      expect(childNode).toHaveStyle({ marginLeft: '25px' });
    });

    it('should handle State with collapsed nodes', () => {
      const collapsedNodes: Node[] = [
        {
          id: 1,
          name: 'Node 1',
          state: { expanded: false },
          children: [{ id: 11, name: 'Node 1.1' }],
        },
        { id: 2, name: 'Node 2' },
      ];
      const state = TreeState.createFromTree(collapsedNodes);

      render(
        <Tree
          nodes={state}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      // Only root nodes should be visible when parent is collapsed
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
      expect(screen.queryByTestId('node-11')).not.toBeInTheDocument();
    });
  });

  describe('scrolling', () => {
    it('should accept scrollToIndex prop', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
          scrollToIndex={2}
        />
      );

      // Component should render without error
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });

    it('should accept scrollToAlignment prop', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
          scrollToAlignment="center"
        />
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });
  });

  describe('custom width', () => {
    it('should accept custom width prop', () => {
      render(
        <Tree
          nodes={flattenedNodes}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
          width={500}
        />
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });
  });

  describe('empty tree', () => {
    it('should handle empty nodes array', () => {
      render(
        <Tree
          nodes={[]}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      expect(screen.queryByTestId('node-1')).not.toBeInTheDocument();
    });

    it('should handle empty State', () => {
      const state = TreeState.createFromTree([]);

      render(
        <Tree
          nodes={state}
          NodeRenderer={NodeRenderer}
          onChange={mockOnChange}
        />
      );

      expect(screen.queryByTestId('node-1')).not.toBeInTheDocument();
    });
  });
});
