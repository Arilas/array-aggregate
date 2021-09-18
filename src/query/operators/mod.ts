import { Matcher, Match } from '../createMatcher'

export function mod<T extends number>([divisor, remainder]: [
  number,
  number,
]): Match<T> {
  return (value: T) =>
    Array.isArray(value)
      ? value.some((val) => val % divisor === remainder)
      : value % divisor === remainder
}
