import { cond } from '../../utils/cond'
import {
  isLogical,
  isValue,
  isElement,
  isArray,
  Operands,
} from '../utils/checks'
import { logicalFlow, logicalFlowDev } from './logical'
import { valueFlow, valueFlowDev } from './value'
import { elementFlow, elementFlowDev } from './element'
import { elemMatchFlow, elemMatchFlowDev } from './elemMatch'
import { arrayFlow, arrayFlowDev } from './array'

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
