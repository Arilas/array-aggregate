/** @flow */

export function size(rule: number) {
  return value => {
    return value && (value.length === rule || value.size === rule)
  }
}