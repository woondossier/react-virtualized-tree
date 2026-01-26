import { describe, it, expect } from 'vitest';
import { getFlattenedTree } from './getFlattenedTree.js';

describe('getFlattenedTree', () => {
  const createTestTree = () => [
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

  describe('basic flattening', () => {
    it('should flatten an empty tree', () => {
      const result = getFlattenedTree([]);
      expect(result).toEqual([]);
    });

    it('should flatten a single node without children', () => {
      const nodes = [{ id: 1, name: 'Single', children: [] }];
      const result = getFlattenedTree(nodes);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Single');
    });

    it('should add deepness property to nodes', () => {
      const nodes = createTestTree();
      const result = getFlattenedTree(nodes);

      // Root nodes should have deepness 0
      const node1 = result.find((n) => n.id === 1);
      expect(node1.deepness).toBe(0);

      // Child nodes should have deepness 1
      const node2 = result.find((n) => n.id === 2);
      expect(node2.deepness).toBe(1);
    });

    it('should add parents array to nodes', () => {
      const nodes = createTestTree();
      const result = getFlattenedTree(nodes);

      // Root nodes should have empty parents array
      const node1 = result.find((n) => n.id === 1);
      expect(node1.parents).toEqual([]);

      // Child nodes should have parent ids
      const node2 = result.find((n) => n.id === 2);
      expect(node2.parents).toEqual([1]);
    });
  });

  describe('expanded nodes', () => {
    it('should include children of expanded nodes', () => {
      const nodes = createTestTree();
      const result = getFlattenedTree(nodes);

      // Node 1 is expanded, so its children should be in the result
      expect(result.some((n) => n.id === 2)).toBe(true);
      expect(result.some((n) => n.id === 3)).toBe(true);
    });

    it('should not include children of collapsed nodes', () => {
      const nodes = createTestTree();
      const result = getFlattenedTree(nodes);

      // Node 4 (Node 2) is collapsed, so its children should NOT be in the result
      expect(result.some((n) => n.id === 5)).toBe(false);
    });

    it('should include all nodes when all are expanded', () => {
      const nodes = [
        {
          id: 1,
          name: 'Node 1',
          state: { expanded: true },
          children: [
            {
              id: 2,
              name: 'Node 1.1',
              state: { expanded: true },
              children: [{ id: 3, name: 'Node 1.1.1', children: [] }],
            },
          ],
        },
      ];

      const result = getFlattenedTree(nodes);

      expect(result).toHaveLength(3);
      expect(result.map((n) => n.id)).toEqual([1, 2, 3]);
    });
  });

  describe('deep nesting', () => {
    it('should handle deeply nested trees', () => {
      const deepTree = [
        {
          id: 1,
          state: { expanded: true },
          children: [
            {
              id: 2,
              state: { expanded: true },
              children: [
                {
                  id: 3,
                  state: { expanded: true },
                  children: [
                    {
                      id: 4,
                      state: { expanded: true },
                      children: [{ id: 5, children: [] }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = getFlattenedTree(deepTree);

      expect(result).toHaveLength(5);

      // Check deepness increases correctly
      expect(result[0].deepness).toBe(0);
      expect(result[1].deepness).toBe(1);
      expect(result[2].deepness).toBe(2);
      expect(result[3].deepness).toBe(3);
      expect(result[4].deepness).toBe(4);

      // Check parents accumulate correctly
      expect(result[4].parents).toEqual([1, 2, 3, 4]);
    });
  });

  describe('order preservation', () => {
    it('should maintain sibling order', () => {
      const nodes = [
        { id: 1, name: 'First', children: [] },
        { id: 2, name: 'Second', children: [] },
        { id: 3, name: 'Third', children: [] },
      ];

      const result = getFlattenedTree(nodes);

      expect(result.map((n) => n.id)).toEqual([1, 2, 3]);
    });

    it('should place children immediately after parent', () => {
      const nodes = [
        {
          id: 1,
          state: { expanded: true },
          children: [
            { id: 2, children: [] },
            { id: 3, children: [] },
          ],
        },
        { id: 4, children: [] },
      ];

      const result = getFlattenedTree(nodes);

      expect(result.map((n) => n.id)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('immutability', () => {
    it('should not modify original nodes', () => {
      const nodes = createTestTree();
      const originalNode1 = { ...nodes[0] };

      getFlattenedTree(nodes);

      // Original node should not have deepness or parents added
      expect(nodes[0]).toEqual(originalNode1);
    });

    it('should return new node objects', () => {
      const nodes = [{ id: 1, name: 'Test', children: [] }];
      const result = getFlattenedTree(nodes);

      // Result should be a different object reference
      expect(result[0]).not.toBe(nodes[0]);
    });
  });
});
