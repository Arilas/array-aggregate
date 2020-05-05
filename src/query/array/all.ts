/** @flow */
import { Matcher, Match } from '../createMatcher'

// TODO: $elemMatch support

export function all<T extends any[]>(rule: Matcher<T>[]): Match<T> {
  if (rule.length == 0) {
    return () => false
  }
  return (value: T) =>
    Array.isArray(value)
      ? rule.every((matcher) => value.some(matcher.match))
      : value != undefined
      ? rule.every((matcher) => matcher.match(value))
      : false
}
