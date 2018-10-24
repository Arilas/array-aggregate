/** @flow */
import { eq } from '../operators/eq'

export function all(rule: Array<*>) {
  const rules = rule.map(item => (Array.isArray(item) ? all(item) : eq(item)))
  return value =>
    rules.every(
      rule =>
        Array.isArray(value) ? value.some(val => rule(val)) : rule(value),
    )
}
