import { Matcher, Match } from '../createMatcher.js'

export function nor<T>(matchers: Array<Matcher<T>>): Match<T> {
  return (ctx) => matchers.every((matcher) => !matcher.match(ctx))
}
