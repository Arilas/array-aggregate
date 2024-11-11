import { isAnyDate } from '../../query/utils/safeDate.js'

export function gte(rawRule: Date): (value: Date | number | string) => boolean
export function gte(rawRule: string): (value: Date | number | string) => boolean
export function gte(rawRule: number): (value: number | string) => boolean

export function gte(rawRule: string | number | Date) {
  let rule = rawRule
  // Handling correctly formed dates
  if (isAnyDate(rule)) {
    rule = new Date(rawRule)
  } else if (typeof rule === 'string' && !Number.isNaN(parseFloat(rule))) {
    rule = parseFloat(rule)
  }
  if (rule instanceof Date) {
    return (value: string | Date) => {
      if (value instanceof Date) {
        return value.valueOf() >= rule.valueOf()
      } else {
        return new Date(value).valueOf() >= rule.valueOf()
      }
    }
  }
  if (typeof rule === 'number') {
    return (value: string | number) => {
      if (typeof value === 'string' && !Number.isNaN(parseFloat(value))) {
        return parseFloat(value) >= rule
      } else {
        return (value as number) >= rule
      }
    }
  }
  return (value: number) => {
    const res = rule.localeCompare(value.toString())
    return res === 0 || res === -1
  }
}
