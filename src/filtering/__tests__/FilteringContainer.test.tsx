import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FilteringContainer from '../../FilteringContainer';
import type { Node, Groups, FilteringContainerRenderProps, DebouncerFn } from '../../types';

const sampleNodes: Node[] = [
  { id: 1, name: 'Apple', children: [{ id: 11, name: 'Fuji' }] },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

const renderTree = ({ nodes }: FilteringContainerRenderProps) => (
  <ul data-testid="tree">
    {nodes.map((node) => (
      <li key={node.id} data-testid={`node-${node.id}`}>
        {node.name}
      </li>
    ))}
  </ul>
);

describe('FilteringContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('should render all nodes initially', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
      expect(screen.getByTestId('node-3')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const icon = document.querySelector('.mi-search');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should filter nodes based on search term after debounce', async () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'Apple' } });

      // Before debounce, all nodes should still be visible
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();

      // After debounce
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.queryByTestId('node-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('node-3')).not.toBeInTheDocument();
    });

    it('should be case insensitive', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'apple' } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.queryByTestId('node-2')).not.toBeInTheDocument();
    });

    it('should show "No matching nodes found" when filter matches nothing', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'xyz' } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByText('No matching nodes found.')).toBeInTheDocument();
      expect(screen.queryByTestId('tree')).not.toBeInTheDocument();
    });

    it('should trim search term', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: '  Apple  ' } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
    });

    it('should reset debounce on rapid input', () => {
      render(<FilteringContainer nodes={sampleNodes}>{renderTree}</FilteringContainer>);

      const input = screen.getByPlaceholderText('Search...');

      fireEvent.change(input, { target: { value: 'A' } });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      fireEvent.change(input, { target: { value: 'Ap' } });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      fireEvent.change(input, { target: { value: 'Cherry' } });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should only show Cherry, not Apple
      expect(screen.queryByTestId('node-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('node-3')).toBeInTheDocument();
    });
  });

  describe('groups', () => {
    const groups: Groups = {
      fruits: {
        name: 'Fruits',
        filter: (node: Node) => ['Apple', 'Banana', 'Cherry'].includes(node.name),
      },
      apples: {
        name: 'Apples Only',
        filter: (node: Node) => node.name === 'Apple' || node.name === 'Fuji',
      },
    };

    it('should render group renderer when groups provided', () => {
      render(
        <FilteringContainer nodes={sampleNodes} groups={groups} selectedGroup="fruits">
          {renderTree}
        </FilteringContainer>
      );

      // Check that the group class is applied
      const lookupInput = document.querySelector('.tree-lookup-input.group');
      expect(lookupInput).toBeInTheDocument();
    });

    it('should filter by selected group', () => {
      render(
        <FilteringContainer nodes={sampleNodes} groups={groups} selectedGroup="apples">
          {renderTree}
        </FilteringContainer>
      );

      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.queryByTestId('node-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('node-3')).not.toBeInTheDocument();
    });

    it('should call onSelectedGroupChange when group changes', () => {
      const onSelectedGroupChange = vi.fn();

      render(
        <FilteringContainer
          nodes={sampleNodes}
          groups={groups}
          selectedGroup="fruits"
          onSelectedGroupChange={onSelectedGroupChange}
        >
          {renderTree}
        </FilteringContainer>
      );

      // The DefaultGroupRenderer renders a select, simulate a change
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'apples' } });

      expect(onSelectedGroupChange).toHaveBeenCalledWith('apples');
    });
  });

  describe('custom indexSearch', () => {
    it('should use custom indexSearch function', () => {
      const customIndexSearch = (searchTerm: string) => (node: Node) =>
        node.name.startsWith(searchTerm);

      render(
        <FilteringContainer nodes={sampleNodes} indexSearch={customIndexSearch}>
          {renderTree}
        </FilteringContainer>
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'Ban' } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId('node-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
      expect(screen.queryByTestId('node-3')).not.toBeInTheDocument();
    });
  });

  describe('custom debouncer', () => {
    it('should use custom debouncer function', () => {
      const customDebouncer = vi.fn((fn: (...args: unknown[]) => void, _timeout: number) => {
        const debouncedFn = (...args: unknown[]) => fn(...args); // Immediate execution
        debouncedFn.cancel = vi.fn();
        return debouncedFn;
      });

      render(
        <FilteringContainer nodes={sampleNodes} debouncer={customDebouncer as DebouncerFn}>
          {renderTree}
        </FilteringContainer>
      );

      expect(customDebouncer).toHaveBeenCalled();

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'Apple' } });

      // With immediate debouncer, filtering should happen immediately
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.queryByTestId('node-2')).not.toBeInTheDocument();
    });
  });

  describe('nodeParentMappings', () => {
    it('should pass nodeParentMappings to children', () => {
      const renderTreeWithMappings = ({ nodes, nodeParentMappings }: FilteringContainerRenderProps) => (
        <div>
          <span data-testid="mappings">{JSON.stringify(nodeParentMappings)}</span>
          <ul>
            {nodes.map((node) => (
              <li key={node.id}>{node.name}</li>
            ))}
          </ul>
        </div>
      );

      render(
        <FilteringContainer nodes={sampleNodes}>{renderTreeWithMappings}</FilteringContainer>
      );

      const mappings = screen.getByTestId('mappings');
      expect(mappings).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should cancel debounce on unmount', () => {
      const cancelFn = vi.fn();
      const customDebouncer = vi.fn((fn: (...args: unknown[]) => void, _timeout: number) => {
        const debouncedFn = (...args: unknown[]) => fn(...args);
        debouncedFn.cancel = cancelFn;
        return debouncedFn;
      });

      const { unmount } = render(
        <FilteringContainer nodes={sampleNodes} debouncer={customDebouncer as DebouncerFn}>
          {renderTree}
        </FilteringContainer>
      );

      unmount();

      expect(cancelFn).toHaveBeenCalled();
    });
  });
});
