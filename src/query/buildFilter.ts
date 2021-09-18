import { createMatcher, Matcher } from './createMatcher'
import { fieldSelector } from './fieldSelector'

import { cond, T } from '../utils/cond'
import { Query } from './types'
import { isOperand, Operands } from './utils/checks'
import { Schema } from './utils/Schema'
import { value2Flow, value2FlowDev } from './flows/simpleValue'
import { operatorsFlow, operatorsFlowDev } from './flows/operators'

export const flowDev = cond([
  [isOperand, operatorsFlowDev],
  [T, value2FlowDev],
])

export const flow = cond([
  [isOperand, operatorsFlow],
  [T, value2Flow],
])

export function buildFilterDev<T extends object = {}>(
  query: Query<T>,
  key?: string | undefined,
  schema: Schema = {},
): Matcher<T> {
  const matchers = Object.keys(query).map((operand) => {
    const part = query[operand]
    return flowDev(operand as Operands, part, schema, key)
  })
  const matcher = createMatcher(
    (ctx: any) => matchers.every((matcher) => matcher.match(ctx)),
    fieldSelector(undefined),
  )
  matcher.schema = schema
  return matcher
}

export function buildFilter<T extends object = {}>(
  query: Query<T>,
  key?: string | undefined,
): Matcher<T> {
  const matchers = Object.keys(query).map((operand) => {
    const part = query[operand]
    return flow(operand as Operands, part, key)
  })
  return createMatcher(
    (ctx: any) => matchers.every((matcher) => matcher.match(ctx)),
    fieldSelector(undefined),
  )
}
