import React, { forwardRef, memo, type KeyboardEvent } from 'react';
import classNames from 'classnames';

import { submitEvent } from '../eventWrappers';
import { getNodeRenderOptions, updateNode } from '../selectors/nodes';
import type { FavoriteRendererProps } from '../types';

const Favorite = memo(
  forwardRef<HTMLSpanElement, FavoriteRendererProps>(
    (
      {
        onChange,
        node,
        iconsClassNameMap = {
          favorite: 'mi mi-star',
          notFavorite: 'mi mi-star-border',
        },
        children,
        index,
      },
      ref
    ) => {
      const { isFavorite } = getNodeRenderOptions(node);

      const className = classNames({
        [iconsClassNameMap.favorite || '']: isFavorite,
        [iconsClassNameMap.notFavorite || '']: !isFavorite,
      });

      const handleChange = () => onChange({ ...updateNode(node, { favorite: !isFavorite }), index });

      return (
        <span ref={ref}>
          <i
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => submitEvent(handleChange)(e)}
            onClick={handleChange}
            className={className}
          />
          {children}
        </span>
      );
    }
  )
);

Favorite.displayName = 'Favorite';

export default Favorite;
