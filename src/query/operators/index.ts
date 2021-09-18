import { eq } from './eq'
import { gt } from './gt'
import { gte } from './gte'
import { lt } from './lt'
import { lte } from './lte'
import { mod } from './mod'
import { ne } from './ne'
import { inFn } from './in'
import { nin } from './nin'
import { Match } from '../createMatcher'

export type ValueOperands =
  | '$eq'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$mod'
  | '$ne'
  | '$in'
  | '$nin'
export type ValueType = { [key in ValueOperands]: <T>(rule: any) => Match<T> }

export default {
  $eq: eq,
  $gt: gt,
  $gte: gte,
  $lt: lt,
  $lte: lte,
  $mod: mod,
  $ne: ne,
  $in: inFn,
  $nin: nin,
} as ValueType
