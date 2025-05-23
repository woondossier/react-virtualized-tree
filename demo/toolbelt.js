// Set your actual GitHub repo root here (no trailing slash)
const GITHUB_REPO = 'https://github.com/woondossier/react-virtualized-tree'; // ← UPDATE THIS

/**
 * Returns the GitHub repo URL
 */
export const getRepoPath = () => GITHUB_REPO;

/**
 * Generates a URL to a source file on GitHub
 */
export const getExamplePath = (name) =>
  `${GITHUB_REPO}/blob/master/demo/examples/${name}.js`;

/**
 * Generates a raw GitHub URL for a Markdown document
 */
export const getDocumentFetchUrl = (doc) => {
  const repoParts = GITHUB_REPO.replace('https://github.com/', '');
  return `https://raw.githubusercontent.com/${repoParts}/master/demo/docs/${doc}.md`;
};

/**
 * Creates an entry map for docs or examples
 */
export const createEntry = (key, fileName, name, description, component) => ({
  [key]: {
    name,
    fileName,
    description,
    component,
  },
});

// ID generation for test tree construction
let ids = {};

const getUniqueId = () => {
  const id = Math.floor(Math.random() * 1_000_000_000);
  return ids[id] ? getUniqueId() : (ids[id] = true, id);
};

/**
 * Recursively constructs a random tree for demo purposes
 */
export const constructTree = (
  maxDepth,
  maxChildren,
  minNodes,
  depth = 1
) => {
  return new Array(minNodes).fill(null).map(() => {
    const id = getUniqueId();
    const numChildren =
      depth === maxDepth ? 0 : Math.round(Math.random() * maxChildren);

    return {
      id,
      name: `Leaf ${id}`,
      children:
        numChildren > 0
          ? constructTree(maxDepth, maxChildren, numChildren, depth + 1)
          : [],
      state: {
        expanded: !!numChildren && Math.random() > 0.5,
        favorite: Math.random() > 0.5,
        deletable: Math.random() > 0.5,
      },
    };
  });
};
