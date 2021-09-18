import { eq } from './eq'

export function ne(
  rule: (string | number | Date | (string | number | Date)[])[],
): (value: string | Date | number | (string | Date | number)[]) => boolean {
  // @ts-ignore
  const equals = eq(rule)
  return (value: string | number | Date | (string | number | Date)[]) =>
    // @ts-ignore
    !equals(value)
}
