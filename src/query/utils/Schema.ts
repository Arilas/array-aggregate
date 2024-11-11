import { Matcher } from '../createMatcher'
import { Operands } from './checks'

export type SchemaPart =
  | {
      $_Val?: any
      $_Field?: string
      $_SchemaKey?: string
      $_Matcher?: Matcher<any>
    }
  | {
      $_Val?: any
      $_Field?: string
      $_SchemaKey?: string
      $_Matcher?: Matcher<any>
    }[]

export type Schema = Partial<{ [key in Operands]: SchemaPart & Schema }> & {
  [key: string]: { [key in Operands]: SchemaPart }
}

export const setInSchema =
  (val: () => SchemaPart = () => ({})) =>
  (
    operand: Operands,
    value: any,
    schema: Schema,
    key: string | undefined,
  ): [Operands, any, Schema, string | undefined] => {
    // @ts-ignore
    schema[operand] = val()
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    schema[operand].$_Val = value
    // @ts-ignore
    schema[operand].$_Field = key
    // @ts-ignore
    schema[operand].$_SchemaKey = operand

    return [operand, value, schema, key]
  }
