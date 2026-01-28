import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Favorite from '../Favorite';
import { KEY_CODES } from '../../eventWrappers';
import { updateNode } from '../../selectors/nodes';
import type { FlattenedNode, NodeAction, FavoriteIconsClassNameMap, Node } from '../../types';

describe('renderers Favorite', () => {
  interface SetupProps {
    iconsClassNameMap?: FavoriteIconsClassNameMap;
  }

  const setup = (state: { favorite?: boolean } = {}, extraProps: SetupProps = {}) => {
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
      ...render(<Favorite {...props} />),
      props,
    };
  };

  describe('when favorite', () => {
    it('should render an icon with the supplied className', () => {
      const { container, props } = setup(
        { favorite: true },
        {
          iconsClassNameMap: {
            favorite: 'fav',
            notFavorite: 'non-fav',
          },
        }
      );

      expect(container.querySelector(`.${props.iconsClassNameMap!.favorite}`)).not.toBeNull();
      expect(container.querySelector(`.mi.mi-star`)).toBeNull();
    });

    it('should render an icon with the default className when a map is not provided', () => {
      const { container } = setup({ favorite: true });

      expect(container.querySelector(`.mi.mi-star`)).not.toBeNull();
    });

    it('clicking should call onChange with the correct params', () => {
      const { container, props } = setup({ favorite: true });

      fireEvent.click(container.querySelector('i')!);

      expect(props.onChange).toHaveBeenCalledWith({
        ...updateNode(props.node, { favorite: false }),
        index: props.index,
      });
    });

    it('pressing enter should call onChange with the correct params', () => {
      const { container, props } = setup({ favorite: true });

      fireEvent.keyDown(container.querySelector('i')!, { keyCode: KEY_CODES.Enter });

      expect(props.onChange).toHaveBeenCalledWith({
        ...updateNode(props.node, { favorite: false }),
        index: props.index,
      });
    });
  });

  describe('when not favorite', () => {
    it('should render a with the supplied className', () => {
      const { container, props } = setup(
        { favorite: false },
        {
          iconsClassNameMap: {
            favorite: 'fav',
            notFavorite: 'non-fav',
          },
        }
      );

      expect(container.querySelector(`.${props.iconsClassNameMap!.notFavorite}`)).not.toBeNull();
      expect(container.querySelector(`.mi.mi-star-border`)).toBeNull();
    });

    it('should render an icon with the default className when a map is not provided', () => {
      const { container } = setup({ favorite: false });

      expect(container.querySelector(`.mi.mi-star-border`)).not.toBeNull();
    });

    it('clicking should call onChange with the correct params', () => {
      const { container, props } = setup({ favorite: false });

      fireEvent.click(container.querySelector('i')!);

      expect(props.onChange).toHaveBeenCalledWith({
        ...updateNode(props.node, { favorite: true }),
        index: props.index,
      });
    });

    it('pressing enter should call onChange with the correct params', () => {
      const { container, props } = setup({ favorite: false });

      fireEvent.keyDown(container.querySelector('i')!, { keyCode: KEY_CODES.Enter });

      expect(props.onChange).toHaveBeenCalledWith({
        ...updateNode(props.node, { favorite: true }),
        index: props.index,
      });
    });
  });
});
