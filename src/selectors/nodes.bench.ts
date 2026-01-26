import { describe, bench } from 'vitest';
import {
  replaceNodeFromTree,
  deleteNodeFromTree,
  getNodeRenderOptions,
  getRowIndexFromId,
  getNodeFromPath,
} from './nodes';
import { getFlattenedTree } from './getFlattenedTree';
import { generateTree, countNodes, TREE_SIZES } from '../test/benchUtils';
import type { FlattenedNode } from '../types';

// Pre-generate trees
const smallTree = generateTree(TREE_SIZES.SMALL.depth, TREE_SIZES.SMALL.childrenPerNode);
const mediumTree = generateTree(TREE_SIZES.MEDIUM.depth, TREE_SIZES.MEDIUM.childrenPerNode);
const largeTree = generateTree(TREE_SIZES.LARGE.depth, TREE_SIZES.LARGE.childrenPerNode);

// Pre-flatten trees for certain benchmarks
const smallFlattened = getFlattenedTree(smallTree);
const mediumFlattened = getFlattenedTree(mediumTree);
const largeFlattened = getFlattenedTree(largeTree);

console.log('Tree sizes for node operations:');
console.log(`  Small: ${countNodes(smallTree)} nodes (${smallFlattened.length} flattened)`);
console.log(`  Medium: ${countNodes(mediumTree)} nodes (${mediumFlattened.length} flattened)`);
console.log(`  Large: ${countNodes(largeTree)} nodes (${largeFlattened.length} flattened)`);

describe('replaceNodeFromTree', () => {
  // Get nodes at different depths for testing
  const shallowNode = smallFlattened.find((n) => n.deepness === 0)!;
  const mediumDepthNode = mediumFlattened.find((n) => n.deepness === 2)!;
  const deepNode = largeFlattened.find((n) => n.deepness === 4)!;

  describe('by tree size', () => {
    bench('small tree - replace root node', () => {
      const updatedNode = { ...shallowNode, name: 'Updated' };
      replaceNodeFromTree(smallTree, updatedNode);
    });

    bench('medium tree - replace shallow node', () => {
      const node = mediumFlattened.find((n) => n.deepness === 1)!;
      const updatedNode = { ...node, name: 'Updated' };
      replaceNodeFromTree(mediumTree, updatedNode);
    });

    bench('large tree - replace deep node', () => {
      const updatedNode = { ...deepNode, name: 'Updated' };
      replaceNodeFromTree(largeTree, updatedNode);
    });
  });

  describe('by node depth', () => {
    bench('depth 0 (root)', () => {
      const updatedNode = { ...shallowNode, name: 'Updated' };
      replaceNodeFromTree(smallTree, updatedNode);
    });

    bench('depth 2', () => {
      const updatedNode = { ...mediumDepthNode, name: 'Updated' };
      replaceNodeFromTree(mediumTree, updatedNode);
    });

    bench('depth 4', () => {
      const updatedNode = { ...deepNode, name: 'Updated' };
      replaceNodeFromTree(largeTree, updatedNode);
    });
  });
});

describe('deleteNodeFromTree', () => {
  const leafNode = mediumFlattened.find((n) => !n.children || n.children.length === 0)!;
  const midNode = mediumFlattened.find((n) => n.deepness === 2)!;

  bench('delete leaf node', () => {
    deleteNodeFromTree(mediumTree, leafNode);
  });

  bench('delete mid-level node', () => {
    deleteNodeFromTree(mediumTree, midNode);
  });
});

describe('getNodeRenderOptions', () => {
  const expandedNode = {
    state: { expanded: true, favorite: true },
    children: [{}],
  } as unknown as FlattenedNode;
  const collapsedNode = { state: { expanded: false }, children: [] } as unknown as FlattenedNode;

  bench('with expanded node', () => {
    getNodeRenderOptions(expandedNode);
  });

  bench('with collapsed node', () => {
    getNodeRenderOptions(collapsedNode);
  });

  bench('100 calls (selector memoization)', () => {
    for (let i = 0; i < 100; i++) {
      getNodeRenderOptions(expandedNode);
    }
  });
});

describe('getRowIndexFromId', () => {
  const firstId = smallFlattened[0].id;
  const middleId = mediumFlattened[Math.floor(mediumFlattened.length / 2)].id;
  const lastId = largeFlattened[largeFlattened.length - 1].id;

  bench('find first node (small tree)', () => {
    getRowIndexFromId(smallFlattened, firstId);
  });

  bench('find middle node (medium tree)', () => {
    getRowIndexFromId(mediumFlattened, middleId);
  });

  bench('find last node (large tree)', () => {
    getRowIndexFromId(largeFlattened, lastId);
  });
});

describe('getNodeFromPath', () => {
  // Create paths of different lengths
  const shortPath = [smallTree[0].id];
  const mediumPath = mediumFlattened.find((n) => n.parents.length === 2);
  const longPath = largeFlattened.find((n) => n.parents.length === 4);

  bench('short path (1 level)', () => {
    getNodeFromPath(shortPath, smallTree);
  });

  if (mediumPath) {
    bench('medium path (3 levels)', () => {
      getNodeFromPath([...mediumPath.parents, mediumPath.id], mediumTree);
    });
  }

  if (longPath) {
    bench('long path (5 levels)', () => {
      getNodeFromPath([...longPath.parents, longPath.id], largeTree);
    });
  }
});

describe('full update cycle simulation', () => {
  // Simulate what happens when a user expands a node:
  // 1. Find the node
  // 2. Update it
  // 3. Re-flatten the tree

  bench('expand node cycle (medium tree)', () => {
    const node = mediumFlattened[10];
    const updatedNode = {
      ...node,
      state: { ...node.state, expanded: !node.state?.expanded },
    };
    const newTree = replaceNodeFromTree(mediumTree, updatedNode);
    getFlattenedTree(newTree);
  });

  bench('expand node cycle (large tree)', () => {
    const node = largeFlattened[100];
    const updatedNode = {
      ...node,
      state: { ...node.state, expanded: !node.state?.expanded },
    };
    const newTree = replaceNodeFromTree(largeTree, updatedNode);
    getFlattenedTree(newTree);
  });
});
