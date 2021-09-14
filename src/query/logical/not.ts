import { Matcher, Match } from '../createMatcher'

export function not<T>(matcher: Matcher<T>): Match<T> {
  return (ctx) => !matcher.match(ctx)
}
