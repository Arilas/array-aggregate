import { eq } from './eq'

export function ne(
  rule: string | number | Date | RegExp | (string | number | Date | RegExp)[],
) {
  const equals = eq(rule)
  return (value: string | number | Date | (string | number | Date)[]) =>
    !equals(value)
}
