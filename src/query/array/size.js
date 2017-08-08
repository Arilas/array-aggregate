/** @flow */

export function size(rule: Number) {
  return value => {
    return value.length === rule
  }
}