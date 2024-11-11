import { createMatcher } from '../createMatcher'
import { fieldSelector } from '../fieldSelector'
import array, { ArrayOperands } from '../array'
import { composeArgs } from '../../utils/composeArgs'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher'
import { Schema, setInSchema } from '../utils/Schema'
import { buildFilter, buildFilterDev } from '../buildFilter'

export const elemMatchFlowDev = composeArgs(
  makeDevMatcher(
    (
      operator: ArrayOperands,
      rule: any,
      schema: Schema,
      key: string | undefined,
    ) =>
      createMatcher(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        array[operator](buildFilterDev(rule, undefined, schema[operator])),
        fieldSelector(key),
      ),
  ),
  setInSchema(),
)

export const elemMatchFlow = makeMatcher(
  (operator: ArrayOperands, rule: any, key: string | undefined) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    createMatcher(array[operator](buildFilter(rule)), fieldSelector(key)),
)
