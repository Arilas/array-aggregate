import type { Matcher } from '../types'

export function and(matchers: Array<Matcher>) {
  return ctx => matchers.every(matcher => matcher.match(ctx))
}