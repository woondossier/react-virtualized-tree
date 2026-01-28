import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Expandable from '../Expandable';
import { KEY_CODES } from '../../eventWrappers';
import { updateNode } from '../../selectors/nodes';
import type { FlattenedNode, NodeAction, ExpandableIconsClassNameMap, Node } from '../../types';

describe('renderers Expandable', () => {
  interface SetupProps {
    iconsClassNameMap?: ExpandableIconsClassNameMap;
  }

  const setup = (state: { expanded?: boolean } = {}, extraProps: SetupProps = {}) => {
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
      ...render(<Expandable {...props} />),
      props,
    };
  };

  describe('when contains children', () => {
    describe('when expanded', () => {
      it('should render a with the supplied className when expanded', () => {
        const { container, props } = setup(
          { expanded: true },
          {
            iconsClassNameMap: {
              expanded: 'expanded',
              collapsed: 'colpased',
            },
          }
        );

        expect(container.querySelector(`.${props.iconsClassNameMap!.expanded}`)).not.toBeNull();
        expect(container.querySelector(`.mi.mi-keyboard-arrow-down`)).toBeNull();
      });

      it('should render a with the default className when expanded and className map is not supplied', () => {
        const { container } = setup({ expanded: true });

        expect(container.querySelector(`.mi.mi-keyboard-arrow-down`)).not.toBeNull();
      });

      it('clicking should call onChange with the correct params', () => {
        const { container, props } = setup({ expanded: true });

        fireEvent.click(container.querySelector('i')!);

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: false }),
          index: props.index,
        });
      });

      it('pressing enter should call onChange with the correct params', () => {
        const { container, props } = setup({ expanded: true });

        fireEvent.keyDown(container.querySelector('i')!, { keyCode: KEY_CODES.Enter });

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: false }),
          index: props.index,
        });
      });

      it('double clicking in the parent node should call onChange with the correct params', () => {
        const { props, container } = setup({ expanded: true });

        fireEvent.doubleClick(container.querySelector('i')!);

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: false }),
          index: props.index,
        });
      });
    });

    describe('when collapsed', () => {
      it('should render a with the supplied className when expanded', () => {
        const { container, props } = setup(
          { expanded: false },
          {
            iconsClassNameMap: {
              expanded: 'expanded',
              collapsed: 'colpased',
            },
          }
        );

        expect(container.querySelector(`.${props.iconsClassNameMap!.collapsed}`)).not.toBeNull();
        expect(container.querySelector(`.mi.mi-keyboard-arrow-right`)).toBeNull();
      });

      it('should render a with the supplied default className when map is not supplied', () => {
        const { container } = setup({ expanded: false });

        expect(container.querySelector(`.mi.mi-keyboard-arrow-right`)).not.toBeNull();
      });

      it('clicking should call onChange with the correct params', () => {
        const { container, props } = setup({ expanded: false });

        fireEvent.click(container.querySelector('i')!);

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: true }),
          index: props.index,
        });
      });

      it('pressing enter should call onChange with the correct params', () => {
        const { container, props } = setup({ expanded: false });

        fireEvent.keyDown(container.querySelector('i')!, { keyCode: KEY_CODES.Enter });

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: true }),
          index: props.index,
        });
      });

      it('double clicking in the parent node should call onChange with the correct params', () => {
        const { props, container } = setup({ expanded: false });

        fireEvent.doubleClick(container.querySelector('i')!);

        expect(props.onChange).toHaveBeenCalledWith({
          ...updateNode(props.node, { expanded: true }),
          index: props.index,
        });
      });
    });
  });
});
