
export function inFn(rule) {
  return value => {
    if (Array.isArray(value)) {
      return value.some(item => rule.indexOf(item) !== -1)
    } else {
      return rule.indexOf(value) !== -1
    }
  }
}