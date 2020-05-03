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
const isLogical = (
  key: LogicalOperands,
  ...args: any[]
): key is LogicalOperands => logicalOperators.includes(key)
const isValue = (key: ValueOperands): key is ValueOperands =>
  valueOperators.includes(key)
const isElement = (key: ElementOperands): key is ElementOperands =>
  elementOperators.includes(key)
const isArray = (key: ArrayOperands): key is ArrayOperands =>
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
  | SchemaPart[]

export type Schema = Partial<{ [key in Operands]: SchemaPart & Schema }>

// const flow = cond([[isOperand, cond([[isLogical, (head, value) => {}]])]])

const setInSchema = (val: SchemaPart) => (
  operand: Operands,
  value: any,
  schema: Schema,
): [Operands, any, Schema] => {
  // @ts-ignore
  schema[operand] = val
  // @ts-ignore
  schema[operand].$_Val = value
  return [operand, value, schema]
}

const makeMatcher = (
  maker: (operand: any, value: any, schema: Schema) => Matcher<any>,
) => (operand: any, value: any, schema: Schema) => {
  const matcher = maker(operand, value, schema)
  if (!schema.hasOwnProperty(operand)) {
    throw new Error(`Matcher wrongly registered`)
  }
  // @ts-ignore
  schema[operand].$_Matcher = matcher
  return matcher
}

const ruleIsArray = (operand: Operands, value: any, schema: Schema) => {
  return Array.isArray(value)
}
const ruleIsSimple = (operand: Operands, value: any, schema: Schema) => {
  return isSimpleValue(value)
}
const T = () => true

export const operatorsFlow = cond([
  [
    isLogical,
    cond([
      [
        ruleIsArray,
        makeMatcher(
          (operator: LogicalOperands, rule: any[], schema: Schema) => {
            const part: SchemaPart[] = []
            schema[operator] = part
            // @ts-ignore
            schema[operator].$_Val = rule
            // @ts-ignore
            schema[operator].$_SchemaKey = operator
            const matchers = rule.map((line) => {
              const lineSchema = {}
              part.push(lineSchema)
              return buildFilter(line, undefined, lineSchema)
            })
            return createMatcher(
              logical[operator](matchers),
              fieldSelector(operator),
            )
          },
        ),
      ],
      [
        T,
        composeArgs(
          cond([
            [
              ruleIsSimple,
              makeMatcher((operator: LogicalOperands, rule: any) =>
                createMatcher(
                  logical[operator](
                    createMatcher(
                      operators.$eq(rule),
                      fieldSelector(undefined),
                    ),
                  ),
                  fieldSelector(operator),
                ),
              ),
            ],
            [
              T,
              makeMatcher(
                (operator: LogicalOperands, rule: any, schema: Schema) =>
                  createMatcher(
                    logical[operator](
                      buildFilter(rule, undefined, schema[operator]),
                    ),
                    fieldSelector(operator),
                  ),
              ),
            ],
          ]),
          setInSchema({}),
        ),
      ],
    ]),
  ],
  // [isValue],
  // [isElement],
  // [isArray],
])

export function buildFilter(
  query: { [key: string]: any },
  key?: string | undefined,
  schema: Schema = {},
) {
  // const matchers = Object.keys(query).map(operand => {
  //   const part = query[operand]
  //   if (!isOperand(operand)) {
  //     if (isSimpleValue(part) || Array.isArray(part)) {
  //       schema[operand] = {
  //         $eq: {
  //           $_Val: part,
  //           $_Field: composeKey(key, operand),
  //         },
  //       }
  //       const matcher = createMatcher(
  //         operators.$eq(part),
  //         fieldSelector(composeKey(key, operand)),
  //       )
  //       schema[operand].$eq.$_SchemaKey = key
  //       schema[operand].$eq.$_Matcher = matcher
  //       return matcher
  //     } else {
  //       schema[operand] = {}
  //       return buildFilter(part, composeKey(key, operand), schema[operand])
  //     }
  //   }
  //   if (logical.hasOwnProperty(operand)) {
  //     if (Array.isArray(part)) {
  //       schema[operand] = []
  //       const matchers = part.map(line => {
  //         const lineSchema = {}
  //         schema[operand].push(lineSchema)
  //         return buildFilter(line, undefined, lineSchema)
  //       })
  //       const matcher = createMatcher(
  //         logical[operand](matchers),
  //         fieldSelector(key),
  //       )
  //       schema[operand].$_SchemaKey = key
  //       schema[operand].$_Matcher = matcher
  //       return matcher
  //     } else {
  //       schema[operand] = {}
  //       let matcher
  //       if (isSimpleValue(part)) {
  //         matcher = createMatcher(
  //           logical[operand](
  //             createMatcher(operators.$eq(part), fieldSelector(undefined)),
  //           ),
  //           fieldSelector(key),
  //         )
  //       } else {
  //         matcher = createMatcher(
  //           logical[operand](buildFilter(part, undefined, schema[operand])),
  //           fieldSelector(key),
  //         )
  //       }
  //       schema[operand].$_SchemaKey = key
  //       schema[operand].$_Matcher = matcher
  //       return matcher
  //     }
  //   }
  //   if (operators.hasOwnProperty(operand)) {
  //     schema[operand] = {
  //       $_Val: part,
  //       $_Field: key,
  //     }
  //     const matcher = createMatcher(
  //       operators[operand](part),
  //       fieldSelector(key),
  //     )
  //     schema[operand].$_SchemaKey = key
  //     schema[operand].$_Matcher = matcher
  //     return matcher
  //   }
  //   if (element.hasOwnProperty(operand)) {
  //     schema[operand] = { $_Val: part, $_Field: key }
  //     const matcher = createMatcher(element[operand](part), fieldSelector(key))
  //     schema[operand].$_SchemaKey = key
  //     schema[operand].$_Matcher = matcher
  //     return matcher
  //   }
  //   if (operand === '$elemMatch') {
  //     schema[operand] = {}
  //     const matcher = createMatcher(
  //       array.$elemMatch(buildFilter(part, undefined, schema[operand])),
  //       fieldSelector(key),
  //     )
  //     schema[operand].$_SchemaKey = key
  //     schema[operand].$_Matcher = matcher
  //     return matcher
  //   } else if (array.hasOwnProperty(operand)) {
  //     schema[operand] = []
  //     const matchers = part.map(item => {
  //       const lineSchema = {}
  //       schema[operand].push(lineSchema)
  //       if (isSimpleValue(item)) {
  //         lineSchema.$eq = {
  //           $_Val: item,
  //           $_Field: key,
  //           $_SchemaKey: undefined,
  //           $_Matcher: undefined,
  //         }
  //         const matcher = createMatcher(
  //           operators.$eq(item),
  //           fieldSelector(undefined),
  //         )
  //         lineSchema.$eq.$_SchemaKey = key
  //         lineSchema.$eq.$_Matcher = matcher
  //         return matcher
  //       } else {
  //         return buildFilter(item, undefined, lineSchema)
  //       }
  //     })
  //     const matcher = createMatcher(
  //       array[operand](matchers),
  //       fieldSelector(key),
  //     )
  //     schema[operand].push({
  //       $_SchemaKey: key,
  //       $_Matcher: matcher,
  //     })
  //     return matcher
  //   } else {
  //     throw new Error('Wrong query')
  //   }
  // })
  const matcher = createMatcher(
    // ctx => matchers.every(matcher => matcher.match(ctx)),
    () => true,
    fieldSelector(undefined),
  )
  matcher.schema = schema
  return matcher
}
