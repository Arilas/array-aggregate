const formatToGroups = <T>(value: T[] | T[][]): T[][] =>
  []
    // @ts-ignore
    .concat([value.filter((item) => !Array.isArray(item))])
    // @ts-ignore
    .concat(...value.filter((item) => Array.isArray(item)).map(formatToGroups))

function isDate(_date: string) {
  const _regExp = new RegExp(
    '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$',
  )
  return _regExp.test(_date)
}
// @ts-ignore
export function eq(
  rule: (string | number | Date | (string | number | Date)[])[],
): (value: string | Date | number | (string | Date | number)[]) => boolean
export function eq(
  rawRule:
    | Date
    | string
    | number
    | RegExp
    | (Date | string | number | RegExp)[],
) {
  let rule = rawRule

  if (typeof rule === 'string' && isDate(rule)) {
    rule = new Date(rule)
  }

  if (rule instanceof Date) {
    return (val: string | Date | (string | Date)[]) => {
      const validate = (value: string | Date) => {
        if (value instanceof Date) {
          return value.valueOf() === rule.valueOf()
        } else {
          return value && new Date(value).valueOf() === rule.valueOf()
        }
      }
      if (Array.isArray(val)) {
        return val.some(validate)
      }
      return validate(val)
    }
  }

  if (Array.isArray(rule)) {
    // @ts-ignore
    const rules = rule.map(eq)
    return (value: (string | number | Date)[]) => {
      if (!value || !Array.isArray(value)) return false
      const flatten = formatToGroups(value)
      return flatten.some(
        (part) =>
          part.length == rules.length &&
          rules
            // @ts-ignore
            .map((check) => part.findIndex((val) => check(val)))
            .reduce(
              (target, index) =>
                index !== -1 && target !== -1 && index > target ? index : -1,
              -2,
            ) > -1,
      )
    }
  }
  if (rule === null) {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    return (value: any | null) => value == null
  }
  if (rule instanceof RegExp) {
    return (value: string | number) => value && rule.test(value.toString())
  }
  return (value: string | number | Date | (string | number | Date)[]) => {
    if (Array.isArray(value)) {
      return value.some((val) => val === rule)
    } else {
      return value === rule
    }
  }
}
