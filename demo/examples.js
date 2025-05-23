import basicTree from './examples/Basic/Basic.jsx';
import renderers from './examples/Renderers.jsx';
import worldCup from './examples/WorldCup.jsx';
import changeRenderers from './examples/ChangeRenderers.jsx';
import extensions from './examples/Extensions.jsx';
import filterable from './examples/Filterable.jsx';
import nodeMeasure from './examples/NodeMeasure.jsx';
import keyboardNav from './examples/KeyboardNavigation.jsx';
import largeCollection from './examples/LargeCollection.jsx';

export default {
    ...basicTree,
    ...renderers,
    ...changeRenderers,
    ...worldCup,
    ...largeCollection,
    ...extensions,
    ...filterable,
    ...nodeMeasure,
    ...keyboardNav,
};
