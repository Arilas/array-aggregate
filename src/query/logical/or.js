
export function or(matchers: Array<>) {
  return ctx => matchers.some(matcher => matcher.match(ctx))
}