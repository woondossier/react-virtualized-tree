import { filterNodes } from '../filtering';
import { Nodes } from '../../../testData/sampleTree';
import type { Node } from '../../types';

describe('filtering selectors', () => {
  const pairNodes = (n: Node) => (n.id as number) % 2 === 0;

  it('should filter nodes based on injected filter', () => {
    expect(filterNodes(pairNodes, Nodes).nodes).toMatchSnapshot();
  });

  it('should create mappings matching filters', () => {
    const pairNodes = (n: Node) => (n.id as number) % 2 === 0;

    expect(filterNodes(pairNodes, Nodes).nodeParentMappings).toMatchSnapshot();
  });
});
