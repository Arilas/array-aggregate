import { and } from './and'
import { not } from './not'
import { nor } from './nor'
import { or } from './or'
import { Match, Matcher } from '../createMatcher'

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
