import { cond } from '../../utils/cond.js'
import {
  isLogical,
  isValue,
  isElement,
  isArray,
  Operands,
} from '../utils/checks.js'
import { logicalFlow, logicalFlowDev } from './logical.js'
import { valueFlow, valueFlowDev } from './value.js'
import { elementFlow, elementFlowDev } from './element.js'
import { elemMatchFlow, elemMatchFlowDev } from './elemMatch.js'
import { arrayFlow, arrayFlowDev } from './array.js'

export const operatorsFlowDev = cond([
  [isLogical, logicalFlowDev],
  [isValue, valueFlowDev],
  [isElement, elementFlowDev],
  [(operator: Operands) => operator === '$elemMatch', elemMatchFlowDev],
  [isArray, arrayFlowDev],
])

export const operatorsFlow = cond([
  [isLogical, logicalFlow],
  [isValue, valueFlow],
  [isElement, elementFlow],
  [(operator: Operands) => operator === '$elemMatch', elemMatchFlow],
  [isArray, arrayFlow],
])
