/** @flow */
import { Matcher } from '../createMatcher'

type ElemMatch<T> = (value: T) => boolean

export function elemMatch<T>(matcher: Matcher<T>): ElemMatch<T> {
  return (value) =>
    Array.isArray(value)
      ? value.some((val) => matcher.match(val))
      : matcher.match(value)
}
