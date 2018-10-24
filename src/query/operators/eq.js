export function eq(rule) {
  return value => {
    if (Array.isArray(value)) {
      return value.some(eq(rule))
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
