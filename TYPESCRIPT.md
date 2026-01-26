# TypeScript Migration

This document describes the TypeScript setup, type patterns, and known limitations in the codebase.

## Overview

The codebase has been fully migrated from JavaScript/JSX to strict TypeScript. All source files, tests, and demo files use TypeScript.

## Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

Key strict mode settings are enabled to catch type errors at compile time.

### Build Output

The build generates:
- ES Module: `dist/react-virtualized-tree.es.js`
- CommonJS: `dist/react-virtualized-tree.cjs.js`
- UMD: `dist/react-virtualized-tree.umd.js`
- Type definitions: `dist/types/*.d.ts` (auto-generated via `vite-plugin-dts`)

## Type Definitions

All types are centralized in `src/types/index.ts` and re-exported from the main entry point.

### Core Types

```typescript
type NodeId = number | string;

interface Node {
  id: NodeId;
  name: string;
  state?: NodeState;
  children?: Node[];
}

interface FlattenedNode extends Node {
  deepness: number;
  parents: NodeId[];
}
```

### Component Props

```typescript
interface RendererProps {
  measure: () => void;
  index: number;
  onChange: (action: NodeAction) => void;
  node: FlattenedNode;
  style: CSSProperties;
  children?: ReactNode;
}

interface TreeContainerProps {
  nodes: Node[];
  onChange?: (nodes: Node[]) => void;
  children: ComponentType<RendererProps>;
  // ...
}
```

## Known Type Limitations

### 1. UnstableFastTree Context Type

**File:** `src/UnstableFastTree.tsx`

**Issue:** The `TreeContext` is typed for `Node[]` but `UnstableFastTree` uses it with `State` objects.

```typescript
// Current workaround with type assertion
const contextNodes = unfilteredNodes as unknown as State | null;
const nodes: State = contextNodes ?? propNodes;
```

**Reason:** The context serves dual purposes:
- Normal mode: Passes `Node[]` from `FilteringContainer`
- Fast tree mode: Passes `State` for optimized rendering

**Future Fix:** Create a separate `FastTreeContext` for better type safety:

```typescript
// Proposed solution
interface FastTreeContextValue {
  state: State | null;
}

const FastTreeContext = createContext<FastTreeContextValue>({ state: null });
```

### 2. Dynamic Renderer Composition (Demo)

**File:** `demo/src/examples/Basic/index.tsx`

**Issue:** Dynamic component composition requires flexible types.

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DynamicRenderer = ComponentType<any>;
```

**Reason:** The demo dynamically composes renderers with different prop interfaces (`RendererProps`, `NodeNameRendererProps`), which cannot be expressed with a strict union type without significant complexity.

## Test Type Patterns

### Testing Error Handling

Tests intentionally use `as unknown as` to pass invalid data for testing runtime validation:

```typescript
// Testing that invalid input throws
expect(() => TreeState.createFromTree({} as unknown as Node[])).toThrowError();
expect(() => TreeState.createFromTree('tree' as unknown as Node[])).toThrowError();
```

This is acceptable as it tests the runtime behavior when JavaScript consumers pass invalid data.

### Mock Event Objects

Tests create minimal mock objects for events:

```typescript
const event = {
  key: 'Enter',
  preventDefault: vi.fn(),
} as unknown as KeyboardEvent;
```

## Best Practices

### 1. Avoid Non-Null Assertions

Instead of:
```typescript
const cacheRef = useRef<CellMeasurerCache | null>(null);
// Later: cacheRef.current!.rowHeight
```

Use `useMemo` for guaranteed initialization:
```typescript
const cache = useMemo(() => new CellMeasurerCache({ ... }), []);
// Later: cache.rowHeight
```

### 2. Type Extensions Properly

The `Extensions` type allows custom update handlers:

```typescript
interface Extensions {
  updateTypeHandlers?: { [type: number]: UpdateTypeHandler };
}

// NodeAction allows custom types beyond UPDATE_TYPE
interface NodeAction {
  type: UpdateType | number; // Allows custom update types
  node: FlattenedNode;
  index?: number;
}
```

### 3. Use Proper Generic Constraints

For debounce functions:
```typescript
type DebouncerFn = <Args extends unknown[]>(
  func: (...args: Args) => void,
  timeout: number
) => ((...args: Args) => void) & { cancel: () => void };
```

## Type Checking

Run type checking:
```bash
npm run typecheck
```

This runs `tsc --noEmit` to check all files without emitting output.

## Coverage

Current test coverage: **97%+ line coverage** with 148 tests covering all major functionality.
