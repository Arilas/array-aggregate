/** @flow */
import { createMatcher } from './createMatcher'
import { fieldSelector } from './fieldSelector'

import logical from './logical'
import operators from './operators'
import element from './element'
import array from './array'

const isSimpleValue = value =>
  ['number', 'string', 'undefined', 'boolean'].includes(typeof value) ||
  value == null ||
  value instanceof Date ||
  value instanceof RegExp
const isOperand = key => key.indexOf('$') === 0
const composeKey = (key, operand) => (key ? `${key}.${operand}` : operand)

export function buildFilter(
  query: { [key: string]: any },
  key: ?string,
  schema: Object = {},
) {
  const matchers = Object.keys(query).map(operand => {
    const part = query[operand]
    if (!isOperand(operand)) {
      if (isSimpleValue(part) || Array.isArray(part)) {
        schema[operand] = {
          $eq: {
            $_Val: part,
            $_Field: composeKey(key, operand),
          },
        }
        const matcher = createMatcher(
          operators.$eq(part),
          fieldSelector(composeKey(key, operand)),
        )
        schema[operand].$eq.$_SchemaKey = key
        schema[operand].$eq.$_Matcher = matcher
        return matcher
      } else {
        schema[operand] = {}
        return buildFilter(part, composeKey(key, operand), schema[operand])
      }
    }
    if (logical.hasOwnProperty(operand)) {
      if (Array.isArray(part)) {
        schema[operand] = []
        const matchers = part.map(line => {
          const lineSchema = {}
          schema[operand].push(lineSchema)
          return buildFilter(line, undefined, lineSchema)
        })
        const matcher = createMatcher(
          logical[operand](matchers),
          fieldSelector(key),
        )
        schema[operand].$_SchemaKey = key
        schema[operand].$_Matcher = matcher
        return matcher
      } else {
        schema[operand] = {}
        let matcher
        if (isSimpleValue(part)) {
          matcher = createMatcher(
            logical[operand](
              createMatcher(operators.$eq(part), fieldSelector(undefined)),
            ),
            fieldSelector(key),
          )
        } else {
          matcher = createMatcher(
            logical[operand](buildFilter(part, undefined, schema[operand])),
            fieldSelector(key),
          )
        }
        schema[operand].$_SchemaKey = key
        schema[operand].$_Matcher = matcher
        return matcher
      }
    }
    if (operators.hasOwnProperty(operand)) {
      schema[operand] = {
        $_Val: part,
        $_Field: key,
      }
      const matcher = createMatcher(
        operators[operand](part),
        fieldSelector(key),
      )
      schema[operand].$_SchemaKey = key
      schema[operand].$_Matcher = matcher
      return matcher
    }
    if (element.hasOwnProperty(operand)) {
      schema[operand] = { $_Val: part, $_Field: key }
      const matcher = createMatcher(element[operand](part), fieldSelector(key))
      schema[operand].$_SchemaKey = key
      schema[operand].$_Matcher = matcher
      return matcher
    }
    if (operand === '$elemMatch') {
      schema[operand] = {}
      const matcher = createMatcher(
        array.$elemMatch(buildFilter(part, undefined, schema[operand])),
        fieldSelector(key),
      )
      schema[operand].$_SchemaKey = key
      schema[operand].$_Matcher = matcher
      return matcher
    } else if (array.hasOwnProperty(operand)) {
      schema[operand] = []
      const matchers = part.map(item => {
        const lineSchema = {}
        schema[operand].push(lineSchema)
        if (isSimpleValue(item)) {
          lineSchema.$eq = {
            $_Val: item,
            $_Field: key,
            $_SchemaKey: undefined,
            $_Matcher: undefined,
          }
          const matcher = createMatcher(
            operators.$eq(item),
            fieldSelector(undefined),
          )
          lineSchema.$eq.$_SchemaKey = key
          lineSchema.$eq.$_Matcher = matcher
          return matcher
        } else {
          return buildFilter(item, undefined, lineSchema)
        }
      })
      const matcher = createMatcher(
        array[operand](matchers),
        fieldSelector(key),
      )
      schema[operand].push({
        $_SchemaKey: key,
        $_Matcher: matcher,
      })
      return matcher
    } else {
      throw new Error('Wrong query')
    }
  })
  const matcher = createMatcher(
    ctx => matchers.every(matcher => matcher.match(ctx)),
    fieldSelector(undefined),
  )
  matcher.schema = schema
  return matcher
}
