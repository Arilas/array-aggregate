import { eq } from './eq.js'
import { gt } from './gt.js'
import { gte } from './gte.js'
import { lt } from './lt.js'
import { lte } from './lte.js'
import { mod } from './mod.js'
import { ne } from './ne.js'
import { inFn } from './in.js'
import { nin } from './nin.js'
import { Match } from '../createMatcher.js'

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
