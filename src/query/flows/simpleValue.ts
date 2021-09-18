import { createMatcher } from '../createMatcher'
import { fieldSelector } from '../fieldSelector'
import operators from '../operators'
import { isSimpleValue, composeKey, Operands } from '../utils/checks'
import { makeDevMatcher, makeMatcher } from '../utils/makeMatcher'
import { Schema } from '../utils/Schema'
import { buildFilter, buildFilterDev } from '../buildFilter'

export const value2FlowDev = makeDevMatcher(
  (operator: Operands, rule: any, schema: Schema, key: string | undefined) => {
    if (isSimpleValue(rule) || Array.isArray(rule)) {
      // @ts-ignore
      schema[operator] = {
        // @ts-ignore
        $eq: {
          $_Val: rule,
          $_Field: composeKey(key, operator),
        },
      }
      const matcher = createMatcher(
        operators.$eq(rule),
        fieldSelector(composeKey(key, operator)),
      )
      // @ts-ignore
      schema[operator].$eq.$_SchemaKey = key
      return matcher
    } else {
      // @ts-ignore
      schema[operator] = {}
      // @ts-ignore
      return buildFilterDev(rule, composeKey(key, operator), schema[operator])
    }
  },
)

export const value2Flow = makeMatcher(
  (operator: Operands, rule: any, key: string | undefined) => {
    if (isSimpleValue(rule) || Array.isArray(rule)) {
      return createMatcher(
        operators.$eq(rule),
        fieldSelector(composeKey(key, operator)),
      )
    } else {
      // @ts-ignore
      return buildFilter(rule, composeKey(key, operator))
    }
  },
)
