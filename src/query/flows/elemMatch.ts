import { createMatcher } from '../createMatcher.js'
import { fieldSelector } from '../fieldSelector.js'
import array, { ArrayOperands } from '../array/index.js'
import { composeArgs } from '../../utils/composeArgs.js'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher.js'
import { Schema, setInSchema } from '../utils/Schema.js'
import { buildFilter, buildFilterDev } from '../buildFilter.js'

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
