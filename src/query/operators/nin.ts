import { inFn } from './in.js'

export function nin(
  rule: (
    | string
    | number
    | Date
    | RegExp
    | (string | number | Date | RegExp)[]
  )[],
) {
  const inRes = inFn(rule)
  return (
    value:
      | string
      | number
      | Date
      | (string | number | Date | (string | number | Date)[])[],
  ) => !inRes(value)
}
