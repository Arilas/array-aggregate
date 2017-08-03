
export function nor(matchers: Array<>) {
  return ctx => matchers.every(matcher => !matcher.match(ctx))
}