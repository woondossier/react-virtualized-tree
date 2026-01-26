import React, { type ChangeEvent } from 'react';
import type { GroupRendererProps } from '../types';

const DefaultGroupRenderer: React.FC<GroupRendererProps> = ({ onChange, groups, selectedGroup }) => {
  return (
    <select
      className="tree-group"
      onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
        onChange(value);
      }}
      value={selectedGroup}
    >
      {Object.keys(groups).map((g) => (
        <option key={g} value={g}>
          {groups[g].name}
        </option>
      ))}
    </select>
  );
};

export default DefaultGroupRenderer;
