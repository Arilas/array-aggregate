export function gte(rawRule: Date): (value: Date | number | string) => boolean
export function gte(rawRule: string): (value: Date | number | string) => boolean
export function gte(rawRule: number): (value: number | string) => boolean

export function gte(rawRule: string | number | Date) {
  let rule = rawRule
  // Handling correctly formed dates
  if (typeof rule === 'string' && !Number.isNaN(new Date(rawRule).valueOf())) {
    rule = new Date(rawRule)
  } else if (
    typeof rule === 'number' &&
    !Number.isNaN(new Date(rawRule).valueOf())
  ) {
    rule = new Date(rawRule)
  } else if (typeof rule === 'string' && !Number.isNaN(parseFloat(rule))) {
    rule = parseFloat(rule)
  } else if (typeof rule === 'string' && !Number.isNaN(parseInt(rule))) {
    rule = parseInt(rule)
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
      } else if (typeof value === 'string' && !Number.isNaN(parseInt(value))) {
        return parseInt(value) >= rule
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
