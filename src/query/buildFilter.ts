/** @flow */
import { createMatcher, Matcher } from './createMatcher'
import { fieldSelector } from './fieldSelector'

import logical, { LogicalOperands } from './logical'
import operators, { ValueOperands } from './operators'
import element, { ElementOperands } from './element'
import array, { ArrayOperands } from './array'
import { compose } from '../utils/compose'
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
const isOperand = (key: Operands, ...args: any[]): key is Operands =>
  key.indexOf('$') === 0 ? availableOperators.includes(key) : false
const isLogical = (key: Operands, ...args: any[]): key is LogicalOperands =>
  // @ts-ignore
  logicalOperators.includes(key)
const isValue = (key: Operands, ...args: any[]): key is ValueOperands =>
  // @ts-ignore
  valueOperators.includes(key)
const isElement = (key: Operands, ...args: any[]): key is ElementOperands =>
  // @ts-ignore
  elementOperators.includes(key)
const isArray = (key: Operands, ...args: any[]): key is ArrayOperands =>
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

const setInSchema = (val: () => SchemaPart = () => ({})) => (
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

const makeMatcher = (
  maker: (
    operand: any,
    value: any,
    schema: Schema,
    key: string | undefined,
  ) => Matcher<any>,
) => (operand: any, value: any, schema: Schema, key: string | undefined) => {
  const matcher = maker(operand, value, schema, key)
  if (!schema.hasOwnProperty(operand)) {
    throw new Error(`Matcher wrongly registered`)
  }
  // @ts-ignore
  schema[operand].$_Matcher = matcher
  return matcher
}

const ruleIsArray = (
  operand: Operands,
  value: any,
  schema: Schema,
  key: string | undefined,
) => {
  return Array.isArray(value)
}
const ruleIsSimple = (
  operand: Operands,
  value: any,
  schema: Schema,
  key: string | undefined,
) => {
  return isSimpleValue(value)
}
const T = (...args: any[]) => true

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
        array.$elemMatch(buildFilter(rule, undefined, schema[operator])),
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
      return createMatcher(array[operator](matchers), fieldSelector(key))
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
    //   if (!isOperand(operand)) {
    // if (isSimpleValue(part) || Array.isArray(part)) {
    //   schema[operand] = {
    //     $eq: {
    //       $_Val: part,
    //       $_Field: composeKey(key, operand),
    //     },
    //   }
    //   const matcher = createMatcher(
    //     operators.$eq(part),
    //     fieldSelector(composeKey(key, operand)),
    //   )
    //   schema[operand].$eq.$_SchemaKey = key
    //   schema[operand].$eq.$_Matcher = matcher
    //   return matcher
    // } else {
    //   schema[operand] = {}
    //   return buildFilter(part, composeKey(key, operand), schema[operand])
    // }
    //   }
    // if (logical.hasOwnProperty(operand)) {
    //   if (Array.isArray(part)) {
    //     schema[operand] = []
    //     const matchers = part.map((line) => {
    //       const lineSchema = {}
    //       schema[operand].push(lineSchema)
    //       return buildFilter(line, undefined, lineSchema)
    //     })
    //     const matcher = createMatcher(
    //       logical[operand](matchers),
    //       fieldSelector(key),
    //     )
    //     schema[operand].$_SchemaKey = key
    //     schema[operand].$_Matcher = matcher
    //     return matcher
    //   } else {
    //     schema[operand] = {}
    //     let matcher
    //     if (isSimpleValue(part)) {
    //       matcher = createMatcher(
    //         logical[operand](
    //           createMatcher(operators.$eq(part), fieldSelector(undefined)),
    //         ),
    //         fieldSelector(key),
    //       )
    //     } else {
    //       matcher = createMatcher(
    //         logical[operand](buildFilter(part, undefined, schema[operand])),
    //         fieldSelector(key),
    //       )
    //     }
    //     schema[operand].$_SchemaKey = key
    //     schema[operand].$_Matcher = matcher
    //     return matcher
    //   }
    // }
    // if (operators.hasOwnProperty(operand)) {
    //   schema[operand] = {
    //     $_Val: part,
    //     $_Field: key,
    //   }
    //   const matcher = createMatcher(
    //     operators[operand](part),
    //     fieldSelector(key),
    //   )
    //   schema[operand].$_SchemaKey = key
    //   schema[operand].$_Matcher = matcher
    //   return matcher
    // }
    //   if (element.hasOwnProperty(operand)) {
    //     schema[operand] = { $_Val: part, $_Field: key }
    //     const matcher = createMatcher(element[operand](part), fieldSelector(key))
    //     schema[operand].$_SchemaKey = key
    //     schema[operand].$_Matcher = matcher
    //     return matcher
    //   }
    // if (operand === '$elemMatch') {
    //   schema[operand] = {}
    //   const matcher = createMatcher(
    //     array.$elemMatch(buildFilter(part, undefined, schema[operand])),
    //     fieldSelector(key),
    //   )
    //   schema[operand].$_SchemaKey = key
    //   schema[operand].$_Matcher = matcher
    //   return matcher
    // } else if (array.hasOwnProperty(operand)) {
    //   schema[operand] = []
    //   const matchers = part.map((item) => {
    //     const lineSchema = {}
    //     schema[operand].push(lineSchema)
    //     if (isSimpleValue(item)) {
    //       lineSchema.$eq = {
    //         $_Val: item,
    //         $_Field: key,
    //         $_SchemaKey: undefined,
    //         $_Matcher: undefined,
    //       }
    //       const matcher = createMatcher(
    //         operators.$eq(item),
    //         fieldSelector(undefined),
    //       )
    //       lineSchema.$eq.$_SchemaKey = key
    //       lineSchema.$eq.$_Matcher = matcher
    //       return matcher
    //     } else {
    //       return buildFilter(item, undefined, lineSchema)
    //     }
    //   })
    //   const matcher = createMatcher(
    //     array[operand](matchers),
    //     fieldSelector(key),
    //   )
    //   schema[operand].push({
    //     $_SchemaKey: key,
    //     $_Matcher: matcher,
    //   })
    //   return matcher
    // } else {
    //   throw new Error('Wrong query')
    // }
  })
  const matcher = createMatcher(
    (ctx: any) => matchers.every((matcher) => matcher.match(ctx)),
    // () => true,
    fieldSelector(undefined),
  )
  matcher.schema = schema
  return matcher
}
