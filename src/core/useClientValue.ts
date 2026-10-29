import { useSyncExternalStore } from 'react'

const neverChanges = () => () => {}

/**
 * Reads a browser-only value without a hydration mismatch: the server render
 * and hydration see `serverValue`, the client re-renders with `readClientValue()`.
 * `readClientValue` must return a primitive, so equal reads compare equal.
 */
export const useClientValue = <Value extends string | number | boolean | null>(
  readClientValue: () => Value,
  serverValue: Value,
): Value => useSyncExternalStore(neverChanges, readClientValue, () => serverValue)
