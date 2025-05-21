
import PropTypes from 'prop-types';
import { FlattenedNode } from './nodeShapes';

/**
 * Common prop types expected by node renderer components.
 */
export const Renderer = {
    /**
     * Function that reports a DOM size change (used with react-virtualized).
     */
    measure: PropTypes.func,

    /**
     * Callback to trigger updates to tree state.
     */
    onChange: PropTypes.func.isRequired,

    /**
     * The current node to render.
     */
    node: FlattenedNode,

    /**
     * Row index of the node in the flattened list.
     */
    index: PropTypes.number.isRequired,
};
