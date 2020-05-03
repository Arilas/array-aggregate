/** @flow */
import { Matcher, Match } from '../createMatcher'

export function and<T>(matchers: Matcher<T>[]): Match<T> {
  return (ctx) => matchers.every((matcher) => matcher.match(ctx))
}
