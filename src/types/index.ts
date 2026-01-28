import type { JSX, CSSProperties, ReactNode, ComponentType } from 'react';

// ============================================================================
// Core Types
// ============================================================================

export type NodeId = number | string;

export interface NodeState {
  expanded?: boolean;
  deletable?: boolean;
  favorite?: boolean;
  [key: string]: unknown;
}

export interface Node {
  id: NodeId;
  name: string;
  state?: NodeState;
  children?: Node[];
}

export interface FlattenedNode extends Node {
  deepness: number;
  parents: NodeId[];
}

// ============================================================================
// Constants
// ============================================================================

export const UPDATE_TYPE = {
  ADD: 0,
  DELETE: 1,
  UPDATE: 2,
} as const;

export type UpdateType = (typeof UPDATE_TYPE)[keyof typeof UPDATE_TYPE];

// ============================================================================
// Actions
// ============================================================================

export interface NodeAction {
  type: UpdateType | number; // Allow custom update types for extensions
  node: FlattenedNode;
  index?: number;
}

// ============================================================================
// State Types
// ============================================================================

export type NodePath = NodeId[];

export interface TreeStateData {
  flattenedTree: NodePath[];
  tree: Node[];
}

// ============================================================================
// Extension Types
// ============================================================================

export type UpdateTypeHandler = (nodes: Node[], node: FlattenedNode) => Node[];

export interface Extensions {
  updateTypeHandlers?: { [type: number]: UpdateTypeHandler };
}

// ============================================================================
// Renderer Types
// ============================================================================

export interface RendererProps<T = Record<string, string>> {
  measure: () => void;
  index: number;
  onChange: (action: NodeAction) => void;
  node: FlattenedNode;
  iconsClassNameMap?: T;
  style: CSSProperties;
  children?: ReactNode;
}

export type InjectedRendererProps<T = Record<string, string>> = Omit<RendererProps<T>, 'iconsClassNameMap'>;
export type CustomRendererProps<T = Record<string, string>> = Omit<RendererProps<T>, 'style'>;

export interface DeletableIconsClassNameMap {
  delete?: string;
}

export interface ExpandableIconsClassNameMap {
  expanded?: string;
  collapsed?: string;
  lastChild?: string;
}

export interface FavoriteIconsClassNameMap {
  favorite?: string;
  notFavorite?: string;
}

export type DeletableRendererProps = CustomRendererProps<DeletableIconsClassNameMap>;
export type ExpandableRendererProps = CustomRendererProps<ExpandableIconsClassNameMap>;
export type FavoriteRendererProps = CustomRendererProps<FavoriteIconsClassNameMap>;

// ============================================================================
// Tree Component Types
// ============================================================================

export interface TreeProps {
  nodes: FlattenedNode[] | TreeStateData;
  NodeRenderer: ComponentType<RendererProps>;
  onChange: (action: NodeAction) => void;
  nodeMarginLeft?: number;
  width?: number;
  scrollToIndex?: number;
  scrollToAlignment?: string;
}

export interface TreeContainerProps {
  extensions?: Extensions;
  nodes: Node[];
  onChange?: (nodes: Node[]) => void;
  children: ComponentType<RendererProps>;
  nodeMarginLeft?: number;
  width?: number;
  scrollToId?: NodeId;
  scrollToAlignment?: string;
  onScrollComplete?: () => void;
}

// ============================================================================
// Filtering Types
// ============================================================================

export interface Group {
  filter: (node: Node) => boolean;
  name: string;
}

export interface Groups {
  [key: string]: Group;
}

export interface GroupRendererProps {
  onChange: (selectedGroup: string) => void;
  groups: Groups;
  selectedGroup: string;
}

export interface NodeParentMappings {
  [id: NodeId]: NodeId[];
}

export interface FilteredResult {
  nodes: Node[];
  nodeParentMappings: NodeParentMappings;
}

export interface FilteringContainerRenderProps {
  nodes: Node[];
  nodeParentMappings: NodeParentMappings;
}

export type IndexSearchFn = (searchTerm: string) => (node: Node) => boolean;
export type DebouncerFn = <Args extends unknown[]>(
  func: (...args: Args) => void,
  timeout: number
) => ((...args: Args) => void) & { cancel: () => void };

export interface FilteringContainerProps {
  nodes: Node[];
  children: (params: FilteringContainerRenderProps) => JSX.Element;
  debouncer?: DebouncerFn;
  groups?: Groups;
  selectedGroup?: string;
  groupRenderer?: ComponentType<GroupRendererProps>;
  onSelectedGroupChange?: (selectedGroup: string) => void;
  indexSearch?: IndexSearchFn;
}

// ============================================================================
// Selector Types
// ============================================================================

export interface NodeRenderOptions {
  hasChildren: boolean;
  isExpanded: boolean;
  isFavorite: boolean;
  isDeletable: boolean;
}

export const NODE_CHANGE_OPERATIONS = {
  CHANGE_NODE: 'CHANGE_NODE',
  DELETE_NODE: 'DELETE_NODE',
} as const;

export type NodeChangeOperation = (typeof NODE_CHANGE_OPERATIONS)[keyof typeof NODE_CHANGE_OPERATIONS];

// ============================================================================
// Context Types
// ============================================================================

export interface TreeContextValue {
  unfilteredNodes: Node[] | null;
}
