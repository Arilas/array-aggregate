/** @flow */
import { Matcher, Match } from '../createMatcher'

export function elemMatch<T>(matcher: Matcher<T>): Match<T> {
  return (value: T) =>
    Array.isArray(value)
      ? value.some((val) => matcher.match(val))
      : matcher.match(value)
}
