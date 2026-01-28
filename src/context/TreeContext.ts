import { createContext } from 'react';
import type { TreeContextValue } from '../types';

export const TreeContext = createContext<TreeContextValue>({
  unfilteredNodes: null,
});
