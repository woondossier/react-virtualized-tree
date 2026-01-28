import React, { forwardRef, memo, type KeyboardEvent } from 'react';
import classNames from 'classnames';

import { submitEvent } from '../eventWrappers';
import { getNodeRenderOptions, updateNode } from '../selectors/nodes';
import type { ExpandableRendererProps } from '../types';

const Expandable = memo(
  forwardRef<HTMLSpanElement, ExpandableRendererProps>(
    (
      {
        onChange,
        node,
        children,
        index,
        iconsClassNameMap = {
          expanded: 'mi mi-keyboard-arrow-down',
          collapsed: 'mi mi-keyboard-arrow-right',
          lastChild: '',
        },
      },
      ref
    ) => {
      const { hasChildren, isExpanded } = getNodeRenderOptions(node);
      const className = classNames({
        [iconsClassNameMap.expanded || '']: hasChildren && isExpanded,
        [iconsClassNameMap.collapsed || '']: hasChildren && !isExpanded,
        [iconsClassNameMap.lastChild || '']: !hasChildren,
      });

      const handleChange = () => onChange({ ...updateNode(node, { expanded: !isExpanded }), index });

      return (
        <span ref={ref} onDoubleClick={handleChange}>
          {hasChildren && (
            <i
              tabIndex={0}
              onKeyDown={(e: KeyboardEvent) => submitEvent(handleChange)(e)}
              onClick={handleChange}
              className={className}
            />
          )}
          {children}
        </span>
      );
    }
  )
);

Expandable.displayName = 'Expandable';

export default Expandable;
