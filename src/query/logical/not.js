
export function not(matcher) {
  return ctx => !matcher.match(ctx)
}