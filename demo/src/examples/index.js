import LargeCollection from './LargeCollection.jsx';
import Basic from './Basic';
import Renderers from './Renderers.jsx';
import WorldCup from './WorldCup.jsx';
import ChangeRenderers from './ChangeRenderers.jsx';
import Extensions from './Extensions.jsx';
import Filterable from './Filterable.jsx';
import NodeMeasure from './NodeMeasure.jsx';
import KeyboardNavigation from './KeyboardNavigation.jsx';

export default {
  ...Basic,
  ...Renderers,
  ...ChangeRenderers,
  ...WorldCup,
  ...LargeCollection,
  ...Extensions,
  ...Filterable,
  ...NodeMeasure,
  ...KeyboardNavigation,
};
