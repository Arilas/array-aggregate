/** @flow */

import { Match } from '../createMatcher'

export function size<T extends { length?: number; size?: number }>(
  rule: number,
): Match<T> {
  return (value: T) =>
    Array.isArray(value)
      ? value.length === rule
      : value && value.size
      ? value.size === rule
      : false
}
