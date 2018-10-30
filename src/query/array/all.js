/** @flow */
import type { Matcher } from '../createMatcher'

type AllMatch<T> = (value: T) => boolean

export function all<T>(matchers: Array<Matcher<T>>): AllMatch<T> {
  return value =>
    Array.isArray(value)
      ? matchers.every(matcher => value.some(matcher.match))
      : value != undefined
        ? matchers.every(matcher => matcher.match(value))
        : false
}
