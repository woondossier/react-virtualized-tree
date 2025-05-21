import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { submitEvent } from '../../utils/eventWrappers'
import { getNodeRenderOptions, updateNode } from '../../selectors/nodes';
import { Renderer } from '../../shapes/rendererShapes';

const Expandable = ({
                        onChange,
                        node,
                        children,
                        index,
                        iconsClassNameMap = {
                            expanded: 'mi mi-keyboard-arrow-down',
                            collapsed: 'mi mi-keyboard-arrow-right',
                            lastChild: '',
                        },
                    }) => {
    const { hasChildren, isExpanded } = getNodeRenderOptions(node);

    const iconClass = classNames({
        [iconsClassNameMap.expanded]: hasChildren && isExpanded,
        [iconsClassNameMap.collapsed]: hasChildren && !isExpanded,
        [iconsClassNameMap.lastChild]: !hasChildren,
    });

    const handleToggle = () => {
        onChange({ ...updateNode(node, { expanded: !isExpanded }), index });
    };

    return (
        <span onDoubleClick={handleToggle}>
      {hasChildren && (
          <i
              tabIndex={0}
              role="button"
              aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
              onKeyDown={submitEvent(handleToggle)}
              onClick={handleToggle}
              className={iconClass}
          />
      )}
            {children}
    </span>
    );
};

Expandable.propTypes = {
    ...Renderer,
    iconsClassNameMap: PropTypes.shape({
        expanded: PropTypes.string,
        collapsed: PropTypes.string,
        lastChild: PropTypes.string,
    }),
};

export default Expandable;
