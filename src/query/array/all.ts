/** @flow */
import { Matcher, Match } from '../createMatcher'

export function all<T>(matchers: Matcher<T>[]): Match<T> {
  return (value: T) =>
    Array.isArray(value)
      ? matchers.every((matcher) => value.some(matcher.match))
      : value != undefined
      ? matchers.every((matcher) => matcher.match(value))
      : false
}
