import deepFreeze from 'deep-freeze';

import * as nodeSelectors from '../nodes';
import { Nodes } from '../../../testData/sampleTree';
import { getFlattenedTree } from '../getFlattenedTree';
import type { FlattenedNode, NodeId } from '../../types';

describe('selectors -> nodes ->', () => {
  const getSampleNode = (i = 0): FlattenedNode => getFlattenedTree(Nodes)[i];

  describe('single node actions', () => {
    it('updateNode should update the supplied node state without mutations', () => {
      const originalNode = getSampleNode();

      deepFreeze(originalNode);

      expect(
        nodeSelectors.updateNode(originalNode, { favorite: true, expanded: false })
      ).toMatchSnapshot();
    });

    it('addNode should create the expected object', () => {
      expect(nodeSelectors.addNode(getSampleNode())).toMatchSnapshot();
    });

    it('deleteNode should create the expected object', () => {
      expect(nodeSelectors.deleteNode(getSampleNode())).toMatchSnapshot();
    });
  });

  describe('Tree actions', () => {
    describe('deleteNodeFromTree', () => {
      it('when root node is deleted, should delete that node and all children nodes', () => {
        deepFreeze(Nodes);

        expect(nodeSelectors.deleteNodeFromTree(Nodes, getSampleNode())).toMatchSnapshot();
      });

      it('when a node is deleted, should delete that node and all children nodes', () => {
        deepFreeze(Nodes);

        expect(nodeSelectors.deleteNodeFromTree(Nodes, getSampleNode(1))).toMatchSnapshot();
      });
    });

    it('replaceNodeFromTree should replace a node in the tree without mutations', () => {
      deepFreeze(Nodes);

      const updatedNode = nodeSelectors.updateNode(getSampleNode(), {
        favorite: true,
        expanded: false,
      });

      expect(nodeSelectors.replaceNodeFromTree(Nodes, updatedNode.node)).toMatchSnapshot();
    });
  });

  describe('getNodeRenderOptions', () => {
    it('should extract state from nodes correctly when there are no children', () => {
      expect(
        nodeSelectors.getNodeRenderOptions({
          state: { expanded: true, favorite: true },
        } as FlattenedNode)
      ).toMatchSnapshot();
    });

    it('should extract state from nodes correctly when there are children', () => {
      expect(
        nodeSelectors.getNodeRenderOptions({
          children: [{}],
          state: { deletable: true },
        } as unknown as FlattenedNode)
      ).toMatchSnapshot();
    });

    it('should extract state from nodes correctly when there is no state', () => {
      expect(
        nodeSelectors.getNodeRenderOptions({ children: [{}] } as unknown as FlattenedNode)
      ).toMatchSnapshot();
    });
  });

  describe('getNodeFromPath', () => {
    test('should get a node from a path in the root of the tree', () => {
      expect(nodeSelectors.getNodeFromPath([Nodes[0].id], Nodes)).toEqual(Nodes[0]);
      expect(nodeSelectors.getNodeFromPath([Nodes[1].id], Nodes)).toEqual(Nodes[1]);
      expect(nodeSelectors.getNodeFromPath([Nodes[2].id], Nodes)).toEqual(Nodes[2]);
    });

    test('should get a node from a path in the first set of children of the tree', () => {
      expect(
        nodeSelectors.getNodeFromPath([Nodes[0].id, Nodes[0].children![1].id], Nodes)
      ).toEqual(Nodes[0].children![1]);
    });

    test('should get a node from a path deep in the tree', () => {
      expect(
        nodeSelectors.getNodeFromPath(
          [Nodes[0].id, Nodes[0].children![0].id, Nodes[0].children![0].children![1].id],
          Nodes
        )
      ).toEqual(Nodes[0].children![0].children![1]);
    });

    test('should throw custom error when the path is invalid', () => {
      expect(() => nodeSelectors.getNodeFromPath('' as unknown as NodeId[], Nodes)).toThrowError(
        'path is not an array'
      );
      expect(() => nodeSelectors.getNodeFromPath({} as unknown as NodeId[], Nodes)).toThrowError(
        'path is not an array'
      );
      expect(() => nodeSelectors.getNodeFromPath(1245 as unknown as NodeId[], Nodes)).toThrowError(
        'path is not an array'
      );
      expect(() => nodeSelectors.getNodeFromPath(true as unknown as NodeId[], Nodes)).toThrowError(
        'path is not an array'
      );
    });

    test('should throw custom error when path does not exist in a middle node', () => {
      const { id: existingId1 } = Nodes[0];
      const { id: existingId2 } = Nodes[0].children![0].children![1];

      expect(() =>
        nodeSelectors.getNodeFromPath([existingId1, 25, existingId2], Nodes)
      ).toThrowError(`Could not find node at ${existingId1},25,${existingId2}`);
    });

    test('should throw custom error when path does not exist in the final node', () => {
      const { id: existingId1 } = Nodes[0];
      const { id: existingId2 } = Nodes[0].children![0];

      expect(() =>
        nodeSelectors.getNodeFromPath([existingId1, existingId2, 25], Nodes)
      ).toThrowError(`Could not find node at ${existingId1},${existingId2},25`);
    });
  });
});
