import { createMatcher } from '../createMatcher'
import { fieldSelector } from '../fieldSelector'
import operators, { ValueOperands } from '../operators'
import { composeArgs } from '../../utils/composeArgs'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher'
import { Schema, setInSchema } from '../utils/Schema'

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
