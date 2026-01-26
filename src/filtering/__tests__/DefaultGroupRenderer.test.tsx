import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import DefaultGroupRenderer from '../DefaultGroupRenderer';
import type { Groups } from '../../types';

describe('DefaultGroupRenderer', () => {
  const setup = (extraProps = {}) => {
    const props = {
      onChange: vi.fn(),
      groups: {
        ALL: {
          name: 'All',
          filter: () => true,
        },
        TOP: {
          name: 'Top',
          filter: () => true,
        },
        BOTTOM: {
          name: 'Bottom',
          filter: () => true,
        },
      } as Groups,
      selectedGroup: 'TOP',
      ...extraProps,
    };

    return {
      ...render(<DefaultGroupRenderer {...props} />),
      props,
    };
  };

  it('should render an option for each group', () => {
    const { container } = setup();
    const options = container.querySelectorAll('option');

    const optionsText: string[] = [];

    options.forEach((o) => {
      optionsText.push(o.text);
    });

    expect(optionsText).toMatchSnapshot();
  });

  it('should render the select with the correct value', () => {
    const { container, props } = setup();
    const select = container.querySelector('select') as HTMLSelectElement;

    expect(select.value).toBe(props.selectedGroup);
  });

  it('changing the selection should call onChange with the correct params', () => {
    const { props, container } = setup();
    const value = 'BOTTOM';

    const select = container.querySelector('select') as HTMLSelectElement;
    select.value = value;

    fireEvent.change(select);

    expect(props.onChange).toHaveBeenCalledWith(value);
  });
});
