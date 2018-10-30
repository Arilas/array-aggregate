/** @flow */
import type { Matcher } from '../createMatcher'

type Match<T> = (value: T) => boolean

export function or<T>(matchers: Array<Matcher<T>>): Match<T> {
  return ctx => matchers.some(matcher => matcher.match(ctx))
}
