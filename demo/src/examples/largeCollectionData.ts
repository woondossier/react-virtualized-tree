import { constructTree } from '../toolbelt';
import TreeState from '../../../src/state/TreeState';
import type { Node } from '../../../src';

export const MIN_NUMBER_OF_PARENTS = 500;
export const MAX_NUMBER_OF_CHILDREN = 30;
export const MAX_DEEPNESS = 4;

export const Nodes = constructTree(MAX_DEEPNESS, MAX_NUMBER_OF_CHILDREN, MIN_NUMBER_OF_PARENTS);

const getTotalNumberOfElements = (nodes: Node[], counter = 0): number => {
  return (
    counter +
    nodes.length +
    nodes.reduce((acc, n) => getTotalNumberOfElements(n.children || [], acc), 0)
  );
};

export const totalNumberOfNodes = getTotalNumberOfElements(Nodes);

export const initialTreeState = TreeState.createFromTree(Nodes);
