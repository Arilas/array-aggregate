import { Matcher, Match } from '../createMatcher.js'

export function or<T>(matchers: Array<Matcher<T>>): Match<T> {
  return (ctx) => matchers.some((matcher) => matcher.match(ctx))
}
