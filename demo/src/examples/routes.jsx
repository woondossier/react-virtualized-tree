import React from 'react';

import Basic from './Basic';
import ChangeRenderers from './ChangeRenderers.jsx';
import Extensions from './Extensions.jsx';
import Filterable from './Filterable.jsx';
import KeyboardNavigation from './KeyboardNavigation.jsx';
import LargeCollection from './LargeCollection.jsx';
import NodeMeasure from './NodeMeasure.jsx';
import Renderers from './Renderers.jsx';
import WorldCup from './WorldCup.jsx';

// Import metadata for dynamic descriptions
import { totalNumberOfNodes } from './largeCollectionData.js';

const routes = {
  'basic-tree': {
    name: 'Basic Tree',
    fileName: 'Basic/index',
    description: (
      <div>
        <p>
          A tree that enables favorite toogle, expansion and deletion, this example only makes use of the default
          renderers
        </p>
      </div>
    ),
    component: Basic,
  },
  'customize-renderers': {
    name: 'Customize default renderers',
    fileName: 'ChangeRenderers',
    description: (
      <div>
        <p>
          A good example of a possible customization of a default renderer is customizing the tree to display as a folder
          structure.
        </p>
        <p>
          By exposing <code>iconsClassNameMap</code> it is possible to pass in the styles applied to the Expandable
          rendererer, the available style options are:
        </p>
        {'{ '}
        <code>expanded: string; collapsed: string; lastChild: string;</code>
        {' }'}
      </div>
    ),
    component: ChangeRenderers,
  },
  'extensions': {
    name: 'Extending behaviour',
    fileName: 'Extensions',
    description: (
      <div>
        <p>
          A good example of a possible extension is creating a new handler to select nodes that automatically selects all
          the children nodes.
        </p>
        <p>
          By injecting <code>extensions</code> prop with an update type handler for node selection that can be achieved.
        </p>
      </div>
    ),
    component: Extensions,
  },
  'filterable': {
    name: 'Filterable tree',
    fileName: 'Filterable',
    description: (
      <div>
        <p>When working with big data collections filtering can be very handy.</p>
        <p>
          By wrapping the Tree with the <code>FilteringContainer</code> your tree will only recieve the nodes it needs to
          render.
        </p>
      </div>
    ),
    component: Filterable,
  },
  'keyboard-nav': {
    name: 'Keyboard navigation',
    fileName: 'KeyboardNavigation',
    description: (
      <div>
        <p>A tree that supports keyboard navigation</p>
      </div>
    ),
    component: KeyboardNavigation,
  },
  'large-collection': {
    name: 'Large Data Collection',
    fileName: 'LargeCollection',
    description: (
      <div>
        <p>A tree that renders a large collection of nodes.</p>
        <p>This example is rendering a total of {totalNumberOfNodes} nodes</p>
      </div>
    ),
    component: LargeCollection,
  },
  'node-measure': {
    name: 'Nodes with auto measure',
    fileName: 'NodeMeasure',
    description: (
      <div>
        <p>All cells in react-virtualized-tree implement react-virtualized's CellMeasurer</p>
        <p>
          All nodes receive a measure prop that can be used to measure nodes with different heights like what happens in
          this example
        </p>
      </div>
    ),
    component: NodeMeasure,
  },
  'renderers': {
    name: 'Create a custom renderer',
    fileName: 'Renderers',
    description: (
      <div>
        <p>A tree that makes use of a custom renderer</p>
      </div>
    ),
    component: Renderers,
  },
  'world-cup': {
    name: 'World cup groups',
    fileName: 'WorldCup',
    description: (
      <div>
        <p>
          FIFA world cup is back in 2018, in this special example the tree view is used to display the group stage draw
          results!
        </p>
        <p>Let the best team win.</p>
      </div>
    ),
    component: WorldCup,
  },
};

export default routes;
