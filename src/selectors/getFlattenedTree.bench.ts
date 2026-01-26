import { describe, bench } from 'vitest';
import { getFlattenedTree, getFlattenedTreePaths } from './getFlattenedTree';
import {
  generateTree,
  generateWideTree,
  generateDeepTree,
  countNodes,
  TREE_SIZES,
} from '../test/benchUtils';

// Pre-generate trees to avoid generation overhead in benchmarks
const smallTree = generateTree(TREE_SIZES.SMALL.depth, TREE_SIZES.SMALL.childrenPerNode);
const mediumTree = generateTree(TREE_SIZES.MEDIUM.depth, TREE_SIZES.MEDIUM.childrenPerNode);
const largeTree = generateTree(TREE_SIZES.LARGE.depth, TREE_SIZES.LARGE.childrenPerNode);
const xlargeTree = generateTree(TREE_SIZES.XLARGE.depth, TREE_SIZES.XLARGE.childrenPerNode);

const wideTree = generateWideTree(500, 3); // 500 roots with 3 children each
const deepTree = generateDeepTree(100); // 100 levels deep

console.log('Tree sizes:');
console.log(`  Small: ${countNodes(smallTree)} nodes`);
console.log(`  Medium: ${countNodes(mediumTree)} nodes`);
console.log(`  Large: ${countNodes(largeTree)} nodes`);
console.log(`  XLarge: ${countNodes(xlargeTree)} nodes`);
console.log(`  Wide: ${countNodes(wideTree)} nodes`);
console.log(`  Deep: ${countNodes(deepTree)} nodes`);

describe('getFlattenedTree', () => {
  describe('by tree size', () => {
    bench('small tree (~40 nodes)', () => {
      getFlattenedTree(smallTree);
    });

    bench('medium tree (~780 nodes)', () => {
      getFlattenedTree(mediumTree);
    });

    bench('large tree (~3,900 nodes)', () => {
      getFlattenedTree(largeTree);
    });

    bench('xlarge tree (~5,400 nodes)', () => {
      getFlattenedTree(xlargeTree);
    });
  });

  describe('by tree shape', () => {
    bench('wide tree (500 roots)', () => {
      getFlattenedTree(wideTree);
    });

    bench('deep tree (100 levels)', () => {
      getFlattenedTree(deepTree);
    });
  });
});

describe('getFlattenedTreePaths', () => {
  bench('small tree', () => {
    getFlattenedTreePaths(smallTree);
  });

  bench('medium tree', () => {
    getFlattenedTreePaths(mediumTree);
  });

  bench('large tree', () => {
    getFlattenedTreePaths(largeTree);
  });
});

describe('memoization benefit simulation', () => {
  // Simulate what happens with and without memoization
  // by calling the function repeatedly with the same input

  bench('10 calls without memoization (same tree)', () => {
    for (let i = 0; i < 10; i++) {
      getFlattenedTree(mediumTree);
    }
  });

  // Simulate memoized behavior - only compute once
  bench('10 calls with memoization (cached)', () => {
    const cached = getFlattenedTree(mediumTree);
    for (let i = 0; i < 10; i++) {
      const _ = cached; // Just reference the cached value
    }
  });
});
