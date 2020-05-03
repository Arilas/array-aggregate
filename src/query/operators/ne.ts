import { eq } from './eq'

export function ne(rule: Date): (value: Date | string) => boolean
export function ne(rule: string): (value: Date | string) => boolean
export function ne(rule: number): (value: number | string) => boolean
export function ne(rule: RegExp): (value: string | number) => boolean
export function ne(
  rule: (string | number | Date)[],
): (value: (string | Date | number)[]) => boolean
export function ne(
  rule: string | number | Date | RegExp | (string | number | Date)[],
) {
  // @ts-ignore
  const equals = eq(rule)
  return (value: string | number | Date | (string | number | Date)[]) =>
    !equals(value)
}
