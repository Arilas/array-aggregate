/* eslint-disable import/export */
export function lt(rawRule: Date): (value: Date | string) => boolean
export function lt(rawRule: string): (value: Date | string) => boolean
export function lt(rawRule: number): (value: number | string) => boolean

export function lt(rawRule: string | number | Date) {
  let rule = rawRule
  // Handling correctly formed dates
  if (typeof rule === 'string' && !Number.isNaN(new Date(rawRule).valueOf())) {
    rule = new Date(rawRule)
  }
  if (rule instanceof Date) {
    return (value: string | Date) => {
      if (value instanceof Date) {
        return value.valueOf() < rule.valueOf()
      } else {
        return new Date(value).valueOf() < rule.valueOf()
      }
    }
  }
  if (typeof rule === 'number') {
    return (value: number | string) =>
      typeof value === 'number' ? value < rule : parseFloat(value) < rule
  }
  return (value: number) => value < rule
}
