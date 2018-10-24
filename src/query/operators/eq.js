const flattenValue = value =>
  []
    .concat([value.filter(item => !Array.isArray(item))])
    .concat(...value.filter(item => Array.isArray(item)).map(flattenValue))

export function eq(rule) {
  if (Array.isArray(rule)) {
    return value => {
      if (!value || !Array.isArray(value)) return false
      const flatten = flattenValue(value)
      return flatten.some(
        part =>
          part.length == rule.length &&
          rule
            .map(rulePart => part.findIndex(val => eq(rulePart)(val)))
            .reduce(
              (target, index) =>
                index !== -1 && target !== -1 && index > target ? index : -1,
              -2,
            ) > -1,
      )
    }
  }
  return value => {
    if (Array.isArray(value)) {
      return value.some(val => val === rule)
    } else if (rule instanceof Date) {
      if (value instanceof Date) {
        return value * 1 === rule * 1
      } else {
        return new Date(value) * 1 === rule * 1
      }
    } else if (rule instanceof RegExp) {
      return rule.test(value)
    } else {
      return value === rule
    }
  }
}
