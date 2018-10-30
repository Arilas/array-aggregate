import { eq } from './eq'

export function inFn(rule) {
  return value => {
    if (Array.isArray(value)) {
      return value.some(item => rule.some(val => eq(val)(item)))
    } else {
      return rule.some(val => eq(val)(value))
    }
  }
}
