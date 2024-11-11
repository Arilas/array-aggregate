import { createMatcher } from '../createMatcher.js'
import { fieldSelector } from '../fieldSelector.js'
import element, { ElementOperands } from '../element/index.js'
import { composeArgs } from '../../utils/composeArgs.js'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher.js'
import { Schema, setInSchema } from '../utils/Schema.js'

export const elementFlowDev = composeArgs(
  makeDevMatcher(
    (
      operator: ElementOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ) => createMatcher(element[operator](rule), fieldSelector(key)),
  ),
  setInSchema(),
)

export const elementFlow = makeMatcher(
  (operator: ElementOperands, rule: any, key: string | undefined) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    createMatcher(element[operator](rule), fieldSelector(key)),
)
