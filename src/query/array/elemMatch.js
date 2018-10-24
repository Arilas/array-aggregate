/** @flow */

export function elemMatch(matcher) {
  return value =>
    Array.isArray(value)
      ? value.some(val => matcher.match(val))
      : matcher.match(value)
}
