import PropTypes from 'prop-types';

/**
 * Shape of the `state` object on a node.
 */
export const NodeState = {
    expanded: PropTypes.bool,
    deletable: PropTypes.bool,
    favorite: PropTypes.bool,
};

/**
 * Basic tree node shape.
 */
export const Node = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    state: PropTypes.shape(NodeState),
    children: PropTypes.array, // can be refined later
});

/**
 * A tree node used in rendering — includes depth and ancestry.
 */
export const FlattenedNode = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    state: PropTypes.shape(NodeState),
    deepness: PropTypes.number.isRequired,
    parents: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
});
