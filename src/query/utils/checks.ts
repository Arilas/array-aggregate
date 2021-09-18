import logical, { LogicalOperands } from '../logical'
import operators, { ValueOperands } from '../operators'
import element, { ElementOperands } from '../element'
import array, { ArrayOperands } from '../array'

export type Operands =
  | LogicalOperands
  | ValueOperands
  | ElementOperands
  | ArrayOperands

const logicalOperators: LogicalOperands[] = Object.keys(
  logical,
) as LogicalOperands[]
const valueOperators: ValueOperands[] = Object.keys(
  operators,
) as ValueOperands[]
const elementOperators: ElementOperands[] = Object.keys(
  element,
) as ElementOperands[]
const arrayOperators: ArrayOperands[] = Object.keys(array) as ArrayOperands[]

const availableOperators: Operands[] = ([] as Operands[]).concat(
  logicalOperators,
  valueOperators,
  elementOperators,
  arrayOperators,
)

export const isSimpleValue = (value: any) =>
  ['number', 'string', 'undefined', 'boolean'].includes(typeof value) ||
  value == null ||
  value instanceof Date ||
  value instanceof RegExp

export const isOperand = (key: Operands): key is Operands =>
  key.indexOf('$') === 0 ? availableOperators.includes(key) : false

export const isLogical = (key: Operands): key is LogicalOperands =>
  // @ts-ignore
  logicalOperators.includes(key)

export const isValue = (key: Operands): key is ValueOperands =>
  // @ts-ignore
  valueOperators.includes(key)

export const isElement = (key: Operands): key is ElementOperands =>
  // @ts-ignore
  elementOperators.includes(key)

export const isArray = (key: Operands): key is ArrayOperands =>
  // @ts-ignore
  arrayOperators.includes(key)

export const composeKey = (key: string | undefined, operand: string) =>
  key ? `${key}.${operand}` : operand

export const ruleIsArray = (operand: Operands, value: any) => {
  return Array.isArray(value)
}
export const ruleIsSimple = (operand: Operands, value: any) => {
  return isSimpleValue(value)
}
