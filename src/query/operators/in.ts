import { eq } from './eq'

export function inFn(
  rule: (
    | string
    | number
    | Date
    | RegExp
    | (string | number | Date | RegExp)[]
  )[],
) {
  const matchers = rule.map(eq)
  return (
    value:
      | string
      | number
      | Date
      | (string | number | Date | (string | number | Date)[])[],
  ) => {
    if (Array.isArray(value)) {
      return value.some((item) => matchers.some((check) => check(item)))
    } else {
      return matchers.some((check) => check(value))
    }
  }
}
