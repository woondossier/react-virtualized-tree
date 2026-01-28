interface DocumentEntry {
  name: string;
}

const documents: { [key: string]: DocumentEntry } = {
  renderers: {
    name: 'Renderers',
  },
  extensions: {
    name: 'Extensions',
  },
  filtering: {
    name: 'Filtering',
  },
};

export default documents;
