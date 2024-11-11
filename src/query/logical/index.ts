import { and } from './and.js'
import { not } from './not.js'
import { nor } from './nor.js'
import { or } from './or.js'
import { Match, Matcher } from '../createMatcher.js'

export type LogicalOperands = '$and' | '$not' | '$nor' | '$or'
export type LogicalType = {
  [key in LogicalOperands]: <T>(matcher: Matcher<T> | Matcher<T>[]) => Match<T>
}

export default {
  $and: and,
  $not: not,
  $nor: nor,
  $or: or,
} as LogicalType
