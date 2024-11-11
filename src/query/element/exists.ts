import { Match } from '../createMatcher.js'

export function exists<T>(shouldExists: boolean): Match<T> {
  if (shouldExists) {
    return (value: T | number | string) =>
      value !== undefined && value != 0 && value != ''
  }
  return (value: T) => value === undefined
}
