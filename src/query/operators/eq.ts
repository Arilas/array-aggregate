const flattenValue = (value: any[] | any[][]): any[] =>
  []
    // @ts-ignore
    .concat([value.filter((item) => !Array.isArray(item))])
    .concat(...value.filter((item) => Array.isArray(item)).map(flattenValue))

export function eq(rule: Date): (value: Date | string) => boolean
export function eq(rule: string): (value: Date | string) => boolean
export function eq(rule: number): (value: number | string) => boolean
export function eq(rule: RegExp): (value: string | number) => boolean
export function eq(
  rule: (string | number | Date)[],
): (value: (string | Date | number)[]) => boolean
export function eq(
  rawRule: string | number | Date | RegExp | (string | number | Date)[],
) {
  let rule = rawRule
  // @ts-ignore
  if (typeof rule === 'string' && !Number.isNaN(new Date(rawRule).valueOf())) {
    // @ts-ignore
    rule = new Date(rawRule)
  }
  if (Array.isArray(rule)) {
    // @ts-ignore
    const rules: ((value: string | number | Date) => boolean)[] = rule.map(eq)
    return (value: (string | number | Date)[]) => {
      if (!value || !Array.isArray(value)) return false
      const flatten = flattenValue(value)
      return flatten.some(
        (part) =>
          part.length == rules.length &&
          rules
            .map((check: (value: string | number | Date) => boolean) =>
              part.findIndex((val: string | number | Date) => check(val)),
            )
            .reduce(
              (target, index) =>
                index !== -1 && target !== -1 && index > target ? index : -1,
              -2,
            ) > -1,
      )
    }
  }
  if (rule instanceof Date) {
    return (value: string | Date) => {
      if (value instanceof Date) {
        // @ts-ignore
        return value.valueOf() === rule.valueOf()
      } else {
        return new Date(value).valueOf() === rule.valueOf()
      }
    }
  }
  if (rule instanceof RegExp) {
    return (value: string | number) => (rule as RegExp).test(value.toString())
  }
  return (value: string | number | Date | (string | number | Date)[]) => {
    if (Array.isArray(value)) {
      return value.some((val) => val === rule)
    } else {
      return value === rule
    }
  }
}
