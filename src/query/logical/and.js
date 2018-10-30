/** @flow */
import type { Matcher } from '../createMatcher'

type Match<T> = (value: T) => boolean

export function and<T>(matchers: Array<Matcher<T>>): Match<T> {
  return ctx => matchers.every(matcher => matcher.match(ctx))
}
