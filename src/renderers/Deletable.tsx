import React, { forwardRef, memo, type KeyboardEvent } from 'react';
import classNames from 'classnames';

import { submitEvent } from '../eventWrappers';
import { getNodeRenderOptions, deleteNode } from '../selectors/nodes';
import type { DeletableRendererProps, DeletableIconsClassNameMap } from '../types';

const Deletable = memo(
  forwardRef<HTMLSpanElement, DeletableRendererProps>(
    (
      {
        onChange,
        node,
        iconsClassNameMap = {
          delete: 'mi mi-delete',
        },
        children,
        index,
      },
      ref
    ) => {
      const { isDeletable } = getNodeRenderOptions(node);

      const className = classNames({
        [iconsClassNameMap.delete || '']: isDeletable,
      });

      const handleChange = () => onChange({ ...deleteNode(node), index });

      return (
        <span ref={ref}>
          {isDeletable && (
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

Deletable.displayName = 'Deletable';

export default Deletable;
