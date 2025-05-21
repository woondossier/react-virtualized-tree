import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { submitEvent } from '../../utils/eventWrappers';
import { getNodeRenderOptions, deleteNode } from '../../selectors/nodes';
import { Renderer } from '../../shapes/rendererShapes';

const Deletable = ({
                       onChange,
                       node,
                       iconsClassNameMap = {
                           delete: 'mi mi-delete',
                       },
                       children,
                       index,
                   }) => {
    const { isDeletable } = getNodeRenderOptions(node);

    const iconClass = classNames({
        [iconsClassNameMap.delete]: isDeletable,
    });

    const handleDelete = () => {
        onChange({ ...deleteNode(node), index });
    };

    return (
        <span>
      {isDeletable && (
          <i
              tabIndex={0}
              role="button"
              aria-label="Delete node"
              onKeyDown={submitEvent(handleDelete)}
              onClick={handleDelete}
              className={iconClass}
          />
      )}
            {children}
    </span>
    );
};

Deletable.propTypes = {
    ...Renderer,
    iconsClassNameMap: PropTypes.shape({
        delete: PropTypes.string,
    }),
};

export default Deletable;
