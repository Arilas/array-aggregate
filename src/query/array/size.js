/** @flow */

type SizeMatch = (value: ?Array<any> | Map<*, *>) => boolean

export function size(rule: number): SizeMatch {
  return value =>
    Array.isArray(value)
      ? value.length === rule
      : value && value.size
        ? value.size === rule
        : false
}
