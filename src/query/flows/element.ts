import { createMatcher } from '../createMatcher'
import { fieldSelector } from '../fieldSelector'
import element, { ElementOperands } from '../element'
import { composeArgs } from '../../utils/composeArgs'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher'
import { Schema, setInSchema } from '../utils/Schema'

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
