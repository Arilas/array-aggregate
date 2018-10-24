/** @flow */

export function all(matchers) {
  return value =>
    Array.isArray(value)
      ? matchers.every(matcher => value.some(matcher.match))
      : value != undefined
        ? matchers.every(matcher => matcher.match(value))
        : false
}
