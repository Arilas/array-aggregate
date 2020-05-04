import { Match } from '../createMatcher'

export function exists<T>(shouldExists: boolean): Match<T> {
  return (value: T) =>
    shouldExists ? value !== undefined : value === undefined
}
