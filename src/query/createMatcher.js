/** @flow */

export type Matcher<T> = {|
  match<T: any>(ctx: T): boolean,
  schema?: Object,
|}

type ExtractReturnType = <V>(Generator<V, *, *>) => V

export function createMatcher<T>(
  resolver: Function,
  fieldResolver: $Call<ExtractReturnType, Generator<any, void, void>>,
): Matcher<T> {
  return {
    match(ctx) {
      for (const field of fieldResolver(ctx)) {
        if (resolver(field)) {
          return true
        }
      }

      return false
    },
  }
}
