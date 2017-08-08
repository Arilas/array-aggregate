import { createMatcher, createLogicalMatcher } from './createMatcher'
import { fieldSelector } from './fieldSelector'

import logical from './logical'
import operators from './operators'
import element from './element'
import array from './array'

export function buildFilter(query, key) {
  const [operand, other] = Object.keys(query)
  const part = query[operand]
  if (other > 1) {
    console.log('Not normalized query')
  }
  if (operand.indexOf('$') !== 0) {
    return buildFilter(part, key ? `${key}.${operand}`: operand)
  }
  if (logical.hasOwnProperty(operand)) {
    if (Array.isArray(part)) {
      const matchers = part.map(line => buildFilter(line, key))
      return createLogicalMatcher(logical[operand](matchers))
    } else {
      return createLogicalMatcher(logical[operand](buildFilter(part, key)))
    }
  }
  if (operators.hasOwnProperty(operand)) {
    return createMatcher(operators[operand](part), fieldSelector(key))
  }
  if (element.hasOwnProperty(operand)) {
    return createMatcher(element[operand](part), fieldSelector(key))
  }
  if (array.hasOwnProperty(operand)) {
    return createMatcher(array[operand](part), fieldSelector(key))
  }

}
