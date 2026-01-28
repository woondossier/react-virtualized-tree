import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock CellMeasurerCache class - must be a proper class for `new` to work
class MockCellMeasurerCache {
  rowHeight: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;

  constructor() {
    this.rowHeight = vi.fn().mockReturnValue(30);
    this.clear = vi.fn();
  }
}

// Mock List component with forwardRef to avoid ref warnings
const MockList = React.forwardRef<
  HTMLDivElement,
  {
    rowRenderer: (params: { index: number; key: number; style: object }) => React.ReactNode;
    rowCount: number;
  }
>(({ rowRenderer, rowCount }, ref) => (
  <div data-testid="virtualized-list" ref={ref}>
    {Array.from({ length: Math.min(rowCount, 10) }, (_, index) =>
      rowRenderer({ index, key: index, style: {} })
    )}
  </div>
));
MockList.displayName = 'MockList';

// Mock react-virtualized components for testing
vi.mock('react-virtualized', () => ({
  AutoSizer: ({ children }: { children: (size: { height: number; width: number }) => React.ReactNode }) =>
    children({ height: 500, width: 500 }),
  List: MockList,
  CellMeasurer: ({
    children,
  }: {
    children: (params: { measure: () => void }) => React.ReactNode;
  }) => children({ measure: vi.fn() }),
  CellMeasurerCache: MockCellMeasurerCache,
}));
