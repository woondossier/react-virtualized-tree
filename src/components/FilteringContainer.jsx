import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import DefaultGroupRenderer from './renderers/DefaultGroupRenderer';
import { TreeContext } from '../context/TreeContext';
import { Node } from '../shapes/nodeShapes';
import { filterNodes } from '../selectors/filtering';

const indexByName = (searchTerm) => ({ name }) =>
    name?.toUpperCase().includes(searchTerm.toUpperCase().trim());

export default class FilteringContainer extends React.Component {
    static defaultProps = {
        debouncer: debounce,
        groupRenderer: DefaultGroupRenderer,
        indexSearch: indexByName,
    };

    constructor(props) {
        super(props);

        this.state = {
            filterText: '',
            filterTerm: '',
        };

        this.setFilterTerm = props.debouncer(this.setFilterTerm.bind(this), 300);
    }

    setFilterTerm() {
        this.setState((prevState) => ({ filterTerm: prevState.filterText }));
    }

    handleFilterTextChange = (e) => {
        this.setState({ filterText: e.target.value }, () => {
            this.setFilterTerm();
        });
    };

    render() {
        const { filterText, filterTerm } = this.state;
        const {
            nodes,
            children: treeRenderer,
            groups,
            selectedGroup,
            groupRenderer: GroupRenderer,
            onSelectedGroupChange,
            indexSearch,
        } = this.props;

        const relevantNodes =
            groups && selectedGroup && groups[selectedGroup]
                ? filterNodes(groups[selectedGroup].filter, nodes)
                : { nodes, nodeParentMappings: {} };

        const { nodes: filteredNodes, nodeParentMappings } = filterTerm
            ? filterNodes(indexSearch(filterTerm, relevantNodes.nodes), relevantNodes.nodes)
            : relevantNodes;

        return (
            <TreeContext.Provider value={{ unfilteredNodes: nodes }}>
                <div className="tree-filter-container">
                    <div className={classNames('tree-lookup-input', { group: !!groups })}>
                        <input
                            value={filterText}
                            onChange={this.handleFilterTextChange}
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
                    {treeRenderer({ nodes: filteredNodes, nodeParentMappings })}
                </div>
            </TreeContext.Provider>
        );
    }
}

FilteringContainer.propTypes = {
    children: PropTypes.func.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
    debouncer: PropTypes.func,
    groups: PropTypes.object,
    selectedGroup: PropTypes.string,
    groupRenderer: PropTypes.func,
    onSelectedGroupChange: PropTypes.func,
    indexSearch: PropTypes.func,
};
