import React from 'react';

export const TreeContext = React.createContext({
    depth: 0,
    parentNode: null,
    treeState: null,
});