import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock CellMeasurerCache class - must be a proper class for `new` to work
class MockCellMeasurerCache {
  constructor() {
    this.rowHeight = vi.fn().mockReturnValue(30);
    this.clear = vi.fn();
  }
}

// Mock react-virtualized components for testing
vi.mock('react-virtualized', () => ({
  AutoSizer: ({ children }) => children({ height: 500, width: 500 }),
  List: ({ rowRenderer, rowCount }) => (
    <div data-testid="virtualized-list">
      {Array.from({ length: Math.min(rowCount, 10) }, (_, index) =>
        rowRenderer({ index, key: index, style: {} })
      )}
    </div>
  ),
  CellMeasurer: ({ children }) => children({ measure: vi.fn() }),
  CellMeasurerCache: MockCellMeasurerCache,
}));
