import { Matcher, Match } from '../createMatcher.js'

export function and<T>(matchers: Matcher<T>[]): Match<T> {
  return (ctx) => matchers.every((matcher) => matcher.match(ctx))
}
