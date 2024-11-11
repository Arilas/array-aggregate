import { all } from './all.js'
import { size } from './size.js'
import { elemMatch } from './elemMatch.js'
import { Match } from '../createMatcher.js'

export type ArrayOperands = '$all' | '$size' | '$elemMatch'
export type ArrayType = { [key in ArrayOperands]: <T>(rule: any) => Match<T> }

export default {
  $all: all,
  $size: size,
  $elemMatch: elemMatch,
} as ArrayType
