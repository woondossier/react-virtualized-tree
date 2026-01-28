import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Deletable from '../Deletable';
import { KEY_CODES } from '../../eventWrappers';
import { deleteNode } from '../../selectors/nodes';
import type { FlattenedNode, NodeAction, DeletableIconsClassNameMap, Node } from '../../types';

describe('renderers Deletable', () => {
  interface SetupProps {
    iconsClassNameMap?: DeletableIconsClassNameMap;
  }

  const setup = (state: { deletable?: boolean } = { deletable: true }, extraProps: SetupProps = {}) => {
    const baseNode: FlattenedNode = {
      id: 1,
      name: 'Node 1',
      state,
      deepness: 0,
      parents: [],
      children: [{ id: 2, name: 'Child' } as Node],
    };

    const baseProps = {
      onChange: vi.fn() as (action: NodeAction) => void,
      node: baseNode,
      measure: vi.fn(),
      index: 1,
    };

    const props = { ...baseProps, ...extraProps };

    return {
      ...render(<Deletable {...props} />),
      props,
    };
  };

  describe('when it is deletable', () => {
    it('should render the delete icon with the supplied className', () => {
      const { container, props } = setup(
        { deletable: true },
        {
          iconsClassNameMap: {
            delete: 'delete',
          },
        }
      );

      expect(container.querySelector(`.${props.iconsClassNameMap!.delete}`)).not.toBeNull();
      expect(container.querySelector(`.mi.mi-delete`)).toBeNull();
    });

    it('should render the delete icon with the default className when one is not supplied', () => {
      const { container } = setup();

      expect(container.querySelector(`.mi.mi-delete`)).not.toBeNull();
    });

    it('clicking should call onChange with the correct params', () => {
      const { container, props } = setup();

      fireEvent.click(container.querySelector('i')!);

      expect(props.onChange).toHaveBeenCalledWith({ ...deleteNode(props.node), index: props.index });
    });

    it('pressing enter should call onChange with the correct params', () => {
      const { props, container } = setup();

      fireEvent.keyDown(container.querySelector('i')!, { keyCode: KEY_CODES.Enter });

      expect(props.onChange).toHaveBeenCalledWith({ ...deleteNode(props.node), index: props.index });
    });
  });

  describe('when it is not deletable', () => {
    it('should net render delete icon', () => {
      const { container } = setup({ deletable: false });

      expect(container.querySelector('i')).toBeNull();
    });
  });
});
