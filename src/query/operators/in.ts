import { eq } from './eq'

export function inFn(rule: (string | number | Date | RegExp)[][]) {
  const matchers: ((value: (string | number | Date)[]) => boolean)[] = rule.map(
    // @ts-ignore
    eq,
  )
  return (
    value:
      | string
      | number
      | Date
      | (string | number | Date | (string | number | Date)[])[],
  ) => {
    if (Array.isArray(value)) {
      // @ts-ignore
      return value.some((item) => matchers.some((check) => check(item)))
    } else {
      // @ts-ignore
      return matchers.some((check) => check(value))
    }
  }
}
