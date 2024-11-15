import { Matcher, Match } from '../createMatcher.js'

export function elemMatch<T>(matcher: Matcher<T>): Match<T> {
  return (value: T) =>
    Array.isArray(value)
      ? value.some((val: T) => matcher.match(val))
      : matcher.match(value)
}
