/** @flow */
import { eq } from '../operators/eq'

export function all(rule: Array<*>) {
  return value => {
    return rule.every(item => value.some(val => eq(item)(val)))
  }
}