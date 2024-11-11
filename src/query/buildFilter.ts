/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createMatcher, Matcher } from './createMatcher.js'
import { fieldSelector } from './fieldSelector.js'

import { cond, T } from '../utils/cond.js'
import { Query } from './types.js'
import { isOperand, Operands } from './utils/checks.js'
import { Schema } from './utils/Schema.js'
import { value2Flow, value2FlowDev } from './flows/simpleValue.js'
import { operatorsFlow, operatorsFlowDev } from './flows/operators.js'

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
  key?: string,
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
  key?: string,
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
