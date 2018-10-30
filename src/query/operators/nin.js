import { inFn } from './in'

export function nin(rule) {
  return value => !inFn(rule)(value)
}
