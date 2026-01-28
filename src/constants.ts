export const UPDATE_TYPE = {
  ADD: 0,
  DELETE: 1,
  UPDATE: 2,
} as const;

export type UpdateType = (typeof UPDATE_TYPE)[keyof typeof UPDATE_TYPE];
