import type { Node } from '../../src';

const pkg = await import('../../package.json');

export const getRepoPath = (): string => pkg.repository;

export const getExamplePath = (name: string): string => `${getRepoPath()}/blob/master/demo/src/examples/${name}.js`;

export const getDocumentFetchUrl = (doc: string): string => {
  const docPath = `${getRepoPath()}/master/demo/src/docs/${doc}.md`;

  const url = new URL(docPath);
  url.hostname = 'raw.githubusercontent.com';

  return url.href;
};

export interface ExampleEntry {
  name: string;
  fileName: string;
  description: React.ReactNode;
  component: React.ComponentType;
}

export const createEntry = (
  key: string,
  fileName: string,
  name: string,
  description: React.ReactNode,
  component: React.ComponentType
): { [key: string]: ExampleEntry } => ({
  [key]: {
    name,
    fileName,
    description,
    component,
  },
});

const ids: { [key: number]: boolean } = {};

const getUniqueId = (): number => {
  const candidateId = Math.round(Math.random() * 1000000000);

  if (ids[candidateId]) {
    return getUniqueId();
  }

  ids[candidateId] = true;

  return candidateId;
};

export const constructTree = (
  maxDeepness: number,
  maxNumberOfChildren: number,
  minNumOfNodes: number,
  deepness = 1
): Node[] => {
  return new Array(minNumOfNodes).fill(deepness).map(() => {
    const id = getUniqueId();
    const numberOfChildren =
      deepness === maxDeepness ? 0 : Math.round(Math.random() * maxNumberOfChildren);

    return {
      id,
      name: `Leaf ${id}`,
      children: numberOfChildren
        ? constructTree(maxDeepness, maxNumberOfChildren, numberOfChildren, deepness + 1)
        : [],
      state: {
        expanded: numberOfChildren ? Boolean(Math.round(Math.random())) : false,
        favorite: Boolean(Math.round(Math.random())),
        deletable: Boolean(Math.round(Math.random())),
      },
    };
  });
};
