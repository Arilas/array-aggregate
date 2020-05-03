/** @flow */
import { Matcher } from '../createMatcher'

type AllMatch<T> = (value: T) => boolean

export function all<T>(matchers: Matcher<T>[]): AllMatch<T> {
  return (value) =>
    Array.isArray(value)
      ? matchers.every((matcher) => value.some(matcher.match))
      : value != undefined
      ? matchers.every((matcher) => matcher.match(value))
      : false
}
