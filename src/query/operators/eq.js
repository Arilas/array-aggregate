export function eq(rule) {
  if (Array.isArray(rule)) {
    const rules = rule.map(eq)
    return value => rules.every(rule => rule(value))
  }
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
