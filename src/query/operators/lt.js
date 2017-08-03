
export function lt(rule) {
  return value => {
    if (value instanceof Date) {
      return value * 1 < rule * 1
    } else if (typeof rule === 'number') {
      return parseFloat(value) < parseFloat(rule)
    } else {
      return value < rule
    }
  }
}