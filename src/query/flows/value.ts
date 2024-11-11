import { createMatcher } from '../createMatcher.js'
import { fieldSelector } from '../fieldSelector.js'
import operators, { ValueOperands } from '../operators/index.js'
import { composeArgs } from '../../utils/composeArgs.js'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher.js'
import { Schema, setInSchema } from '../utils/Schema.js'

export const valueFlowDev = composeArgs(
  makeDevMatcher(
    (
      operator: ValueOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
    ) => createMatcher(operators[operator](rule), fieldSelector(key)),
  ),
  setInSchema(),
)

export const valueFlow = makeMatcher(
  (operator: ValueOperands, rule: any, key: string | undefined) =>
    createMatcher(operators[operator](rule), fieldSelector(key)),
)
