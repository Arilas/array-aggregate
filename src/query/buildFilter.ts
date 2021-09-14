/* eslint-disable @typescript-eslint/no-use-before-define */

import { createMatcher, Matcher, createAllMatcher } from './createMatcher'
import { fieldSelector } from './fieldSelector'

import logical, { LogicalOperands } from './logical'
import operators, { ValueOperands } from './operators'
import element, { ElementOperands } from './element'
import array, { ArrayOperands } from './array'
import { cond } from '../utils/cond'
import { composeArgs } from '../utils/composeArgs'
import { Query } from './types'

type Operands =
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

const isSimpleValue = (value: any) =>
  ['number', 'string', 'undefined', 'boolean'].includes(typeof value) ||
  value == null ||
  value instanceof Date ||
  value instanceof RegExp
const isOperand = (key: Operands): key is Operands =>
  key.indexOf('$') === 0 ? availableOperators.includes(key) : false
const isLogical = (key: Operands): key is LogicalOperands =>
  // @ts-ignore
  logicalOperators.includes(key)
const isValue = (key: Operands): key is ValueOperands =>
  // @ts-ignore
  valueOperators.includes(key)
const isElement = (key: Operands): key is ElementOperands =>
  // @ts-ignore
  elementOperators.includes(key)
const isArray = (key: Operands): key is ArrayOperands =>
  // @ts-ignore
  arrayOperators.includes(key)
const composeKey = (key: string | undefined, operand: string) =>
  key ? `${key}.${operand}` : operand

export type SchemaPart =
  | {
      $_Val?: any
      $_Field?: string
      $_SchemaKey?: string
      $_Matcher?: Matcher<any>
    }
  | {
      $_Val?: any
      $_Field?: string
      $_SchemaKey?: string
      $_Matcher?: Matcher<any>
    }[]
// | SchemaPart[]

export type Schema = Partial<{ [key in Operands]: SchemaPart & Schema }> & {
  [key: string]: { [key in Operands]: SchemaPart }
}

// const flow = cond([[isOperand, cond([[isLogical, (head, value) => {}]])]])

const setInSchema =
  (val: () => SchemaPart = () => ({})) =>
  (
    operand: Operands,
    value: any,
    schema: Schema,
    key: string | undefined,
  ): [Operands, any, Schema, string | undefined] => {
    // @ts-ignore
    schema[operand] = val()
    // @ts-ignore
    schema[operand].$_Val = value
    // @ts-ignore
    schema[operand].$_Field = key
    // @ts-ignore
    schema[operand].$_SchemaKey = operand

    return [operand, value, schema, key]
  }

const makeMatcher =
  (
    maker: (
      operand: any,
      value: any,
      schema: Schema,
      key: string | undefined,
    ) => Matcher<any>,
  ) =>
  (operand: any, value: any, schema: Schema, key: string | undefined) => {
    try {
      const matcher = maker(operand, value, schema, key)
      if (!schema.hasOwnProperty(operand)) {
        throw new Error(`Matcher wrongly registered`)
      }
      // @ts-ignore
      schema[operand].$_Matcher = matcher
      return matcher
    } catch (err) {
      console.log(err, operand, value, key, schema)
      throw err
    }
  }

const ruleIsArray = (operand: Operands, value: any) => {
  return Array.isArray(value)
}
const ruleIsSimple = (operand: Operands, value: any) => {
  return isSimpleValue(value)
}
const T = () => true

const logicalFlow = cond([
  [
    ruleIsArray,
    composeArgs(
      makeMatcher(
        (
          operator: LogicalOperands,
          rule: any[],
          schema: Schema,
          key: string | undefined,
        ) => {
          // @ts-ignore
          const part: SchemaPart[] = schema[operator]
          const matchers = rule.map((line) => {
            const lineSchema = {}
            part.push(lineSchema)
            return buildFilter(line, undefined, lineSchema)
          })
          return createMatcher(logical[operator](matchers), fieldSelector(key))
        },
      ),
      setInSchema(() => []),
    ),
  ],
  [
    T,
    composeArgs(
      cond([
        [
          ruleIsSimple,
          makeMatcher(
            (
              operator: LogicalOperands,
              rule: any,
              schema: Schema,
              key: string | undefined,
            ) =>
              createMatcher(
                logical[operator](
                  createMatcher(operators.$eq(rule), fieldSelector(undefined)),
                ),
                fieldSelector(key),
              ),
          ),
        ],
        [
          T,
          makeMatcher(
            (
              operator: LogicalOperands,
              rule: any,
              schema: Schema,
              key: string | undefined,
            ) =>
              createMatcher(
                logical[operator](
                  buildFilter(rule, undefined, schema[operator]),
                ),
                fieldSelector(key),
              ),
          ),
        ],
      ]),
      setInSchema(),
    ),
  ],
])

const valueFlow = composeArgs(
  makeMatcher(
    (
      operator: ValueOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
    ) => createMatcher(operators[operator](rule), fieldSelector(key)),
  ),
  setInSchema(),
)
const elementFlow = composeArgs(
  makeMatcher(
    (
      operator: ElementOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
    ) => createMatcher(element[operator](rule), fieldSelector(key)),
  ),
  setInSchema(),
)

const elemMatchFlow = composeArgs(
  makeMatcher(
    (
      operator: ArrayOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
    ) =>
      createMatcher(
        array[operator](buildFilter(rule, undefined, schema[operator])),
        fieldSelector(key),
      ),
  ),
  setInSchema(),
)

const arrayFlow = composeArgs(
  makeMatcher(
    (
      operator: ArrayOperands,
      rule: any[],
      schema: Schema,
      key: string | undefined,
    ) => {
      if (operator === '$size') {
        return createMatcher(array[operator](rule), fieldSelector(key))
      }
      // @ts-ignore
      const schemaPart: SchemaPart[] = schema[operator]
      const matchers = rule.map((item) => {
        const lineSchema: Schema = {}
        // @ts-ignore
        schemaPart.push(lineSchema)
        if (isSimpleValue(item)) {
          // @ts-ignore
          lineSchema.$eq = {
            $_Val: item,
            $_Field: key,
            $_SchemaKey: undefined,
            $_Matcher: undefined,
          }
          const matcher = createMatcher(
            operators.$eq(item),
            fieldSelector(undefined),
          )
          // @ts-ignore
          lineSchema.$eq.$_SchemaKey = key
          // @ts-ignore
          lineSchema.$eq.$_Matcher = matcher
          return matcher
        } else {
          return buildFilter(item, undefined, lineSchema)
        }
      })
      return createAllMatcher(array[operator](matchers), fieldSelector(key))
    },
  ),
  setInSchema(() => []),
)

export const operatorsFlow = cond([
  [isLogical, logicalFlow],
  [isValue, valueFlow],
  [isElement, elementFlow],
  [(operator: Operands) => operator === '$elemMatch', elemMatchFlow],
  [isArray, arrayFlow],
])

export const value2Flow = makeMatcher(
  (operator: Operands, rule: any, schema: Schema, key: string | undefined) => {
    if (isSimpleValue(rule) || Array.isArray(rule)) {
      // @ts-ignore
      schema[operator] = {
        $eq: {
          $_Val: rule,
          $_Field: composeKey(key, operator),
        },
      }
      const matcher = createMatcher(
        operators.$eq(rule),
        fieldSelector(composeKey(key, operator)),
      )
      // @ts-ignore
      schema[operator].$eq.$_SchemaKey = key
      return matcher
    } else {
      // @ts-ignore
      schema[operator] = {}
      // @ts-ignore
      return buildFilter(rule, composeKey(key, operator), schema[operator])
    }
  },
)

export const flow = cond([
  [isOperand, operatorsFlow],
  [T, value2Flow],
])

export function buildFilter<T extends object = {}>(
  query: Query<T>,
  key?: string | undefined,
  schema: Schema = {},
): Matcher<T> {
  const matchers = Object.keys(query).map((operand) => {
    const part = query[operand]
    return flow(operand as Operands, part, schema, key)
  })
  const matcher = createMatcher(
    (ctx: any) => matchers.every((matcher) => matcher.match(ctx)),
    fieldSelector(undefined),
  )
  matcher.schema = schema
  return matcher
}
