import React, { useState } from 'react';
import classNames from 'classnames';

import Tree from '../../../src/TreeContainer';
import renderers from '../../../src/renderers';
import type { Node, FlattenedNode, RendererProps } from '../../../src';

const { Expandable, Favorite, Deletable } = renderers;

const UPDATE_TYPE = {
  UPDATE: 0,
  DELETE: 1,
  SELECT: 3,
  RENAME: 4,
};

const initialNodes: Node[] = [
  {
    id: 1,
    name: 'Parent 1',
    state: { expanded: true },
    children: [
      {
        id: 11,
        name: 'Child 1.1',
        state: { favorite: false },
      },
      {
        id: 12,
        name: 'Child 1.2',
        state: { favorite: true },
      },
    ],
  },
  {
    id: 2,
    name: 'Parent 2',
    state: { expanded: false, deletable: true },
    children: [
      {
        id: 21,
        name: 'Child 2.1',
      },
    ],
  },
  {
    id: 3,
    name: 'Leaf Node',
    state: { deletable: true },
  },
];

interface SelectableNodeState {
  selected?: boolean;
  expanded?: boolean;
  favorite?: boolean;
  deletable?: boolean;
}

const E2ETestPage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [lastAction, setLastAction] = useState<string>('none');

  const handleChange = (updatedNodes: Node[]) => {
    setNodes(updatedNodes);
  };

  const nodeSelectionHandler = (currentNodes: Node[], updatedNode: FlattenedNode): Node[] =>
    currentNodes.map((node) => {
      if (node.id === updatedNode.id) {
        return { ...updatedNode, children: node.children };
      }
      if (node.children) {
        return { ...node, children: nodeSelectionHandler(node.children, updatedNode) };
      }
      return node;
    });

  const nodeRenameHandler = (currentNodes: Node[], updatedNode: FlattenedNode): Node[] =>
    currentNodes.map((node) => {
      if (node.id === updatedNode.id) {
        return { ...updatedNode, children: node.children };
      }
      if (node.children) {
        return { ...node, children: nodeRenameHandler(node.children, updatedNode) };
      }
      return node;
    });

  // Helper to find a node by ID in the tree
  const findNode = (nodeList: Node[], id: number | string): Node | undefined => {
    for (const node of nodeList) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h2>E2E Test Page</h2>
        <div data-testid="last-action">Last action: {lastAction}</div>
        <button
          data-testid="rename-child-button"
          onClick={() => {
            const currentNode = findNode(nodes, 11);
            if (!currentNode) return;
            const newNodes = nodeRenameHandler(nodes, {
              id: 11,
              name: 'Renamed Child 1.1',
              deepness: 1,
              parents: [1],
              state: currentNode.state || {},
            });
            setNodes(newNodes);
            setLastAction('renamed');
          }}
        >
          Rename Child 1.1
        </button>
        <button
          data-testid="toggle-favorite-button"
          onClick={() => {
            const currentNode = findNode(nodes, 11);
            if (!currentNode) return;
            const currentFavorite = (currentNode.state as SelectableNodeState)?.favorite ?? false;
            const newNodes = nodeSelectionHandler(nodes, {
              id: 11,
              name: currentNode.name,
              deepness: 1,
              parents: [1],
              state: { ...currentNode.state, favorite: !currentFavorite },
            });
            setNodes(newNodes);
            setLastAction('toggled-favorite');
          }}
        >
          Toggle Child 1.1 Favorite
        </button>
        <button
          data-testid="add-child-button"
          onClick={() => {
            const newNodes = nodes.map((node) => {
              if (node.id === 1) {
                return {
                  ...node,
                  children: [
                    ...(node.children || []),
                    {
                      id: 13,
                      name: 'New Child 1.3',
                      state: {},
                    },
                  ],
                };
              }
              return node;
            });
            setNodes(newNodes);
            setLastAction('added-child');
          }}
        >
          Add Child to Parent 1
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <Tree
          nodes={nodes}
          onChange={handleChange}
          extensions={{
            updateTypeHandlers: {
              [UPDATE_TYPE.SELECT]: nodeSelectionHandler,
              [UPDATE_TYPE.RENAME]: nodeRenameHandler,
            },
          }}
        >
          {({ style, node, ...rest }: RendererProps) => {
            const nodeState = node.state as SelectableNodeState | undefined;
            return (
              <div
                style={{
                  ...style,
                  padding: '4px 8px',
                  borderBottom: '1px solid #eee',
                }}
                data-testid={`node-${node.id}`}
                data-node-name={node.name}
                data-node-favorite={nodeState?.favorite ? 'true' : 'false'}
                data-node-selected={nodeState?.selected ? 'true' : 'false'}
                className={classNames({
                  'node-selected': nodeState?.selected,
                  'node-favorite': nodeState?.favorite,
                })}
              >
                <Deletable node={node} {...rest}>
                  <Expandable node={node} {...rest}>
                    <Favorite node={node} {...rest}>
                      <span data-testid={`node-name-${node.id}`}>{node.name}</span>
                    </Favorite>
                  </Expandable>
                </Deletable>
              </div>
            );
          }}
        </Tree>
      </div>
    </div>
  );
};

export default E2ETestPage;
