# @innobrix/react-virtualized-tree

A performant tree view React component built on top of [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/List).

<div align="center" style="margin-bottom: 30px;">
<img src="https://user-images.githubusercontent.com/1521183/37708046-14cf3fb4-2cfd-11e8-9fad-8c0d557397cd.gif" width="650"/>
</div>

## Features

- TypeScript support with full type definitions
- Virtualized rendering for large trees
- Customizable node renderers (Expandable, Deletable, Favorite)
- Built-in filtering with group support
- Tree state management utilities
- React 18 and 19 compatible

## Installation

```bash
npm install @innobrix/react-virtualized-tree
```

or

```bash
yarn add @innobrix/react-virtualized-tree
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react react-dom react-virtualized
```

### Styles

Import the required styles:

```javascript
import 'react-virtualized/styles.css';
```

For the default icon renderers, also import Material Icons:

```javascript
import 'material-icons/css/material-icons.css';
```

## Usage

### Basic Tree

```tsx
import { Tree, TreeState, TreeStateModifiers } from '@innobrix/react-virtualized-tree';
import type { Node, RendererProps } from '@innobrix/react-virtualized-tree';

const nodes: Node[] = [
  {
    id: 1,
    name: 'Parent',
    state: { expanded: true },
    children: [
      { id: 2, name: 'Child 1' },
      { id: 3, name: 'Child 2' },
    ],
  },
];

function MyTree() {
  const [treeNodes, setTreeNodes] = useState(nodes);

  return (
    <Tree nodes={treeNodes} onChange={setTreeNodes}>
      {({ node, ...rest }: RendererProps) => (
        <div>{node.name}</div>
      )}
    </Tree>
  );
}
```

### With Filtering

```tsx
import { Tree, FilteringContainer } from '@innobrix/react-virtualized-tree';

function FilterableTree() {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <FilteringContainer nodes={nodes}>
      {({ nodes: filteredNodes }) => (
        <Tree nodes={filteredNodes} onChange={setNodes}>
          {({ node }) => <div>{node.name}</div>}
        </Tree>
      )}
    </FilteringContainer>
  );
}
```

### Built-in Renderers

The library provides several built-in renderers:

```tsx
import { renderers } from '@innobrix/react-virtualized-tree';

const { Expandable, Deletable, Favorite } = renderers;
```

## API

### Exports

```typescript
import {
  Tree,                  // Main tree component
  FilteringContainer,    // Container for filtering functionality
  TreeState,             // Tree state management
  TreeStateModifiers,    // State modification utilities
  selectors,             // Node selection utilities
  renderers,             // Built-in renderers (Expandable, Deletable, Favorite)
  constants,             // Constants (UPDATE_TYPE, etc.)
  debounce,              // Debounce utility
} from '@innobrix/react-virtualized-tree';
```

### Types

```typescript
import type {
  Node,
  NodeId,
  NodeState,
  FlattenedNode,
  NodeAction,
  RendererProps,
  TreeProps,
  TreeContainerProps,
  FilteringContainerProps,
  Extensions,
  UpdateType,
} from '@innobrix/react-virtualized-tree';
```

### Tree Props

| Prop | Type | Description |
|------|------|-------------|
| `nodes` | `Node[]` | Array of tree nodes |
| `onChange` | `(nodes: Node[]) => void` | Callback when nodes change |
| `children` | `ComponentType<RendererProps>` | Node renderer component |
| `nodeMarginLeft` | `number` | Left margin for nested nodes (default: 25) |
| `width` | `number` | Tree width |
| `scrollToId` | `NodeId` | ID of node to scroll to |
| `scrollToAlignment` | `string` | Scroll alignment |
| `onScrollComplete` | `() => void` | Callback when scroll completes |
| `extensions` | `Extensions` | Custom update type handlers |

### Node Structure

```typescript
interface Node {
  id: NodeId;           // Unique identifier (number or string)
  name: string;         // Display name
  state?: NodeState;    // Node state (expanded, deletable, favorite, etc.)
  children?: Node[];    // Child nodes
}

interface NodeState {
  expanded?: boolean;
  deletable?: boolean;
  favorite?: boolean;
  [key: string]: unknown;  // Custom state properties
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Build
npm run build

# Lint
npm run lint
```

## License

MIT

## Credits

Originally forked from [diogofcunha/react-virtualized-tree](https://github.com/diogofcunha/react-virtualized-tree).
