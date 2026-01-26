import { describe, it, expect } from 'vitest';
import routes from './routes.jsx';

describe('Demo Routes', () => {
  describe('route structure', () => {
    it('should export routes object', () => {
      expect(routes).toBeDefined();
      expect(typeof routes).toBe('object');
    });

    it('should have all expected route keys', () => {
      const expectedKeys = [
        'basic-tree',
        'customize-renderers',
        'extensions',
        'filterable',
        'keyboard-nav',
        'large-collection',
        'node-measure',
        'renderers',
        'world-cup',
      ];

      expectedKeys.forEach((key) => {
        expect(routes).toHaveProperty(key);
      });
    });
  });

  describe('route properties', () => {
    const routeKeys = Object.keys(routes);

    routeKeys.forEach((key) => {
      describe(`route: ${key}`, () => {
        it('should have a name property', () => {
          expect(routes[key]).toHaveProperty('name');
          expect(typeof routes[key].name).toBe('string');
          expect(routes[key].name.length).toBeGreaterThan(0);
        });

        it('should have a fileName property', () => {
          expect(routes[key]).toHaveProperty('fileName');
          expect(typeof routes[key].fileName).toBe('string');
        });

        it('should have a description property', () => {
          expect(routes[key]).toHaveProperty('description');
        });

        it('should have a component property', () => {
          expect(routes[key]).toHaveProperty('component');
          // Component should be a function (React component)
          expect(typeof routes[key].component).toBe('function');
        });
      });
    });
  });

  describe('specific routes', () => {
    it('basic-tree should have correct metadata', () => {
      expect(routes['basic-tree'].name).toBe('Basic Tree');
      expect(routes['basic-tree'].fileName).toBe('Basic/index');
    });

    it('large-collection should have dynamic description with node count', () => {
      const description = routes['large-collection'].description;
      // The description should contain the totalNumberOfNodes
      expect(description).toBeDefined();
    });

    it('world-cup should have correct metadata', () => {
      expect(routes['world-cup'].name).toBe('World cup groups');
      expect(routes['world-cup'].fileName).toBe('WorldCup');
    });
  });
});
