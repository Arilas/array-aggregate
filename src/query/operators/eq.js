
export function eq(rule) {
  return value => {
    if (Array.isArray(value)) {
      return value.indexOf(rule) !== -1
    } else if (value instanceof Date) {
      return value * 1 === rule * 1
    } else {
      return value === rule
    }
  }
}