/** @flow */
import type { Matcher } from '../createMatcher'

type Match<T> = (value: T) => boolean

export function not<T>(matcher: Matcher<T>): Match<T> {
  return ctx => !matcher.match(ctx)
}
