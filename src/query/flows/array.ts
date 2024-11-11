import { createMatcher, createAllMatcher } from '../createMatcher.js'
import { fieldSelector } from '../fieldSelector.js'
import operators from '../operators/index.js'
import array, { ArrayOperands } from '../array/index.js'
import { composeArgs } from '../../utils/composeArgs.js'
import { isSimpleValue } from '../utils/checks.js'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher.js'
import { SchemaPart, Schema, setInSchema } from '../utils/Schema.js'
import { buildFilter, buildFilterDev } from '../buildFilter.js'

export const arrayFlowDev = composeArgs(
  makeDevMatcher(
    (
      operator: ArrayOperands,
      rule: any[],
      schema: Schema,
      key: string | undefined,
    ) => {
      if (operator === '$size') {
        return createMatcher(array[operator](rule), fieldSelector(key))
      }
      // @ts-ignore
      const schemaPart: SchemaPart[] = schema[operator]
      const matchers = rule.map((item) => {
        const lineSchema: Schema = {}
        // @ts-ignore
        schemaPart.push(lineSchema)
        if (isSimpleValue(item)) {
          // @ts-ignore
          lineSchema.$eq = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return buildFilterDev(item, undefined, lineSchema)
        }
      })
      return createAllMatcher(array[operator](matchers), fieldSelector(key))
    },
  ),
  setInSchema(() => []),
)

export const arrayFlow = makeMatcher(
  (operator: ArrayOperands, rule: any[], key: string | undefined) => {
    if (operator === '$size') {
      return createMatcher(array[operator](rule), fieldSelector(key))
    }
    const matchers = rule.map((item) => {
      if (isSimpleValue(item)) {
        return createMatcher(operators.$eq(item), fieldSelector(undefined))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return buildFilter(item)
      }
    })
    return createAllMatcher(array[operator](matchers), fieldSelector(key))
  },
)
