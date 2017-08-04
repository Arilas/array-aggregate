
export function nin(rule) {
  return value => {
    if (Array.isArray(value)) {
      return value.every(item => rule.indexOf(item) === -1)
    } else {
      return rule.indexOf(value) === -1
    }
  }
}