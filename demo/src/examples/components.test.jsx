import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Import all example components
import Basic from './Basic';
import ChangeRenderers from './ChangeRenderers.jsx';
import Extensions from './Extensions.jsx';
import Filterable from './Filterable.jsx';
import KeyboardNavigation from './KeyboardNavigation.jsx';
import LargeCollection from './LargeCollection.jsx';
import NodeMeasure from './NodeMeasure.jsx';
import Renderers from './Renderers.jsx';
import WorldCup from './WorldCup.jsx';

// Mock FocusTrap for KeyboardNavigation
vi.mock('focus-trap-react', () => ({
  default: ({ children }) => <div data-testid="focus-trap">{children}</div>,
}));

describe('Example Components', () => {
  describe('exports', () => {
    it('Basic should export a React component', () => {
      expect(Basic).toBeDefined();
      expect(typeof Basic).toBe('function');
    });

    it('ChangeRenderers should export a React component', () => {
      expect(ChangeRenderers).toBeDefined();
      expect(typeof ChangeRenderers).toBe('function');
    });

    it('Extensions should export a React component', () => {
      expect(Extensions).toBeDefined();
      expect(typeof Extensions).toBe('function');
    });

    it('Filterable should export a React component', () => {
      expect(Filterable).toBeDefined();
      expect(typeof Filterable).toBe('function');
    });

    it('KeyboardNavigation should export a React component', () => {
      expect(KeyboardNavigation).toBeDefined();
      expect(typeof KeyboardNavigation).toBe('function');
    });

    it('LargeCollection should export a React component', () => {
      expect(LargeCollection).toBeDefined();
      expect(typeof LargeCollection).toBe('function');
    });

    it('NodeMeasure should export a React component', () => {
      expect(NodeMeasure).toBeDefined();
      expect(typeof NodeMeasure).toBe('function');
    });

    it('Renderers should export a React component', () => {
      expect(Renderers).toBeDefined();
      expect(typeof Renderers).toBe('function');
    });

    it('WorldCup should export a React component', () => {
      expect(WorldCup).toBeDefined();
      expect(typeof WorldCup).toBe('function');
    });
  });

  describe('rendering', () => {
    it('ChangeRenderers should render without crashing', () => {
      const { container } = render(<ChangeRenderers />);
      expect(container).toBeTruthy();
    });

    it('Extensions should render without crashing', () => {
      const { container } = render(<Extensions />);
      expect(container).toBeTruthy();
    });

    it('Renderers should render without crashing', () => {
      const { container } = render(<Renderers />);
      expect(container).toBeTruthy();
    });

    it('WorldCup should render without crashing', () => {
      const { container } = render(<WorldCup />);
      expect(container).toBeTruthy();
    });

    it('KeyboardNavigation should render without crashing', () => {
      const { container } = render(<KeyboardNavigation />);
      expect(container).toBeTruthy();
    });

    it('NodeMeasure should render without crashing', () => {
      const { container } = render(<NodeMeasure />);
      expect(container).toBeTruthy();
    });
  });
});
