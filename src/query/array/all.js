/** @flow */

export function all(rule: Array<String>) {
  return value => {
    return rule.every(item => value.indexOf(item) !== -1)
  }
}