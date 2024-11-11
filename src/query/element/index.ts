import { exists } from './exists.js'
import { Match } from '../createMatcher.js'

export type ElementOperands = '$exists'
export type ElementType = { [key in ElementOperands]: <T>() => Match<T> }

export default {
  $exists: exists,
}
