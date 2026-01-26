import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import DefaultGroupRenderer from './filtering/DefaultGroupRenderer.jsx';
import { filterNodes } from './selectors/filtering';
import { TreeContext } from './context/TreeContext';

const indexByName = (searchTerm) => ({ name }) => {
  const upperCaseName = name.toUpperCase();
  const upperCaseSearchTerm = searchTerm.toUpperCase();

  return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1;
};

const FilteringContainer = ({
  nodes,
  children: treeRenderer,
  groups,
  selectedGroup,
  groupRenderer: GroupRenderer = DefaultGroupRenderer, // eslint-disable-line no-unused-vars -- used as JSX
  onSelectedGroupChange,
  indexSearch = indexByName,
  debouncer = debounce,
}) => {
  const [filterText, setFilterText] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  // Create a stable debounced setFilterTerm
  const debouncedSetFilterTerm = useRef(null);
  if (!debouncedSetFilterTerm.current) {
    debouncedSetFilterTerm.current = debouncer((text) => {
      setFilterTerm(text);
    }, 300);
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debouncedSetFilterTerm.current?.cancel) {
        debouncedSetFilterTerm.current.cancel();
      }
    };
  }, []);

  const handleFilterTextChange = useCallback((e) => {
    const text = e.target.value;
    setFilterText(text);
    debouncedSetFilterTerm.current(text);
  }, []);

  // Memoize relevantNodes calculation
  const relevantNodes = useMemo(() => {
    if (groups && selectedGroup && groups[selectedGroup]) {
      return filterNodes(groups[selectedGroup].filter, nodes);
    }
    return { nodes, nodeParentMappings: {} };
  }, [groups, selectedGroup, nodes]);

  // Memoize filtered nodes calculation
  const { nodes: filteredNodes, nodeParentMappings } = useMemo(() => {
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
          <input
            value={filterText}
            onChange={handleFilterTextChange}
            placeholder="Search..."
          />
          <i aria-hidden="true" className="mi mi-11 mi-search" />
          {groups && (
            <GroupRenderer
              groups={groups}
              selectedGroup={selectedGroup}
              onChange={onSelectedGroupChange}
            />
          )}
        </div>

        {filteredNodes.length === 0 ? (
          <div style={{ padding: '1rem', color: '#999' }}>
            No matching nodes found.
          </div>
        ) : (
          treeRenderer({ nodes: filteredNodes, nodeParentMappings })
        )}
      </div>
    </TreeContext.Provider>
  );
};

FilteringContainer.propTypes = {
  children: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  debouncer: PropTypes.func,
  groups: PropTypes.objectOf(PropTypes.shape({
    filter: PropTypes.func.isRequired,
    name: PropTypes.string,
  })),
  selectedGroup: PropTypes.string,
  groupRenderer: PropTypes.func,
  onSelectedGroupChange: PropTypes.func,
  indexSearch: PropTypes.func,
};

export default FilteringContainer;
