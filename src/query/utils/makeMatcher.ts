import { Matcher } from '../createMatcher'
import { Schema } from './Schema'

export const makeMatcher =
  (
    maker: (operand: any, value: any, key: string | undefined) => Matcher<any>,
  ) =>
  (operand: any, value: any, key: string | undefined) => {
    return maker(operand, value, key)
  }

export const makeDevMatcher =
  (
    maker: (
      operand: any,
      value: any,
      schema: Schema,
      key: string | undefined,
    ) => Matcher<any>,
  ) =>
  (operand: any, value: any, schema: Schema, key: string | undefined) => {
    try {
      const matcher = maker(operand, value, schema, key)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (!schema.hasOwnProperty(operand)) {
        throw new Error(`Matcher wrongly registered`)
      }
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      schema[operand].$_Matcher = matcher
      return matcher
    } catch (err) {
      console.log(err, operand, value, key, schema)
      throw err
    }
  }
