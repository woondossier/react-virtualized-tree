import React, { useState, useMemo, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import debounce from './utils/debounce';

import DefaultGroupRenderer from './filtering/DefaultGroupRenderer';
import { filterNodes } from './selectors/filtering';
import { TreeContext } from './context/TreeContext';
import type { FilteringContainerProps, Node, FilteredResult } from './types';

const indexByName =
  (searchTerm: string) =>
  ({ name }: Node): boolean => {
    const upperCaseName = name.toUpperCase();
    const upperCaseSearchTerm = searchTerm.toUpperCase();

    return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1;
  };

const FilteringContainer: React.FC<FilteringContainerProps> = ({
  nodes,
  children: treeRenderer,
  groups,
  selectedGroup,
  groupRenderer: GroupRenderer = DefaultGroupRenderer,
  onSelectedGroupChange,
  indexSearch = indexByName,
  debouncer = debounce,
}) => {
  const [filterText, setFilterText] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  // Create a stable debounced setFilterTerm using useMemo
  const debouncedSetFilterTerm = useMemo(
    () =>
      debouncer((text: string) => {
        setFilterTerm(text);
      }, 300),
    [debouncer]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetFilterTerm.cancel();
    };
  }, [debouncedSetFilterTerm]);

  const handleFilterTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setFilterText(text);
      debouncedSetFilterTerm(text);
    },
    [debouncedSetFilterTerm]
  );

  // Memoize relevantNodes calculation
  const relevantNodes = useMemo((): FilteredResult => {
    if (groups && selectedGroup && groups[selectedGroup]) {
      return filterNodes(groups[selectedGroup].filter, nodes);
    }
    return { nodes, nodeParentMappings: {} };
  }, [groups, selectedGroup, nodes]);

  // Memoize filtered nodes calculation
  const { nodes: filteredNodes, nodeParentMappings } = useMemo((): FilteredResult => {
    if (filterTerm) {
      return filterNodes(indexSearch(filterTerm), relevantNodes.nodes);
    }
    return relevantNodes;
  }, [filterTerm, indexSearch, relevantNodes]);

  const contextValue = useMemo(() => ({ unfilteredNodes: nodes }), [nodes]);

  return (
    <TreeContext.Provider value={contextValue}>
      <div className="tree-filter-container">
        <div className={classNames('tree-lookup-input', { group: !!groups })}>
          <input value={filterText} onChange={handleFilterTextChange} placeholder="Search..." />
          <i aria-hidden="true" className="mi mi-11 mi-search" />
          {groups && (
            <GroupRenderer
              groups={groups}
              selectedGroup={selectedGroup || ''}
              onChange={onSelectedGroupChange || (() => {})}
            />
          )}
        </div>

        {filteredNodes.length === 0 ? (
          <div style={{ padding: '1rem', color: '#999' }}>No matching nodes found.</div>
        ) : (
          treeRenderer({ nodes: filteredNodes, nodeParentMappings })
        )}
      </div>
    </TreeContext.Provider>
  );
};

export default FilteringContainer;
