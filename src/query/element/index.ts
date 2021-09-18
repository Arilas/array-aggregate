import { exists } from './exists'
import { Match } from '../createMatcher'

export type ElementOperands = '$exists'
export type ElementType = { [key in ElementOperands]: <T>() => Match<T> }

export default {
  $exists: exists,
}
