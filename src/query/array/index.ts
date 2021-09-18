import { all } from './all'
import { size } from './size'
import { elemMatch } from './elemMatch'
import { Match } from '../createMatcher'

export type ArrayOperands = '$all' | '$size' | '$elemMatch'
export type ArrayType = { [key in ArrayOperands]: <T>(rule: any) => Match<T> }

export default {
  $all: all,
  $size: size,
  $elemMatch: elemMatch,
} as ArrayType
