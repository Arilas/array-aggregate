const flattenValue = (value: any[] | any[][]): any[] =>
  []
    // @ts-ignore
    .concat([value.filter((item) => !Array.isArray(item))])
    .concat(...value.filter((item) => Array.isArray(item)).map(flattenValue))

export function eq(
  rule: string | number | Date | RegExp | (string | number | Date | RegExp)[],
) {
  if (Array.isArray(rule)) {
    return (value: string | number | Date | (string | number | Date)[]) => {
      if (!value || !Array.isArray(value)) return false
      const flatten = flattenValue(value)
      return flatten.some(
        (part) =>
          part.length == rule.length &&
          rule
            .map((rulePart) =>
              part.findIndex(
                (val: string | number | Date | (string | number | Date)[]) =>
                  eq(rulePart)(val),
              ),
            )
            .reduce(
              (target, index) =>
                index !== -1 && target !== -1 && index > target ? index : -1,
              -2,
            ) > -1,
      )
    }
  }
  return (value: string | number | Date | (string | number | Date)[]) => {
    if (Array.isArray(value)) {
      return value.some((val) => val === rule)
    } else if (rule instanceof Date) {
      if (value instanceof Date) {
        // @ts-ignore
        return value * 1 === rule * 1
      } else {
        // @ts-ignore
        return new Date(value) * 1 === rule * 1
      }
    } else if (rule instanceof RegExp) {
      return rule.test(value.toString())
    } else {
      return value === rule
    }
  }
}
