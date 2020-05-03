/** @flow */

export type Matcher<T> = {
  match(ctx: T): boolean
  schema?: Record<string, any>
}

export type Match<T> = (value: T) => boolean

export function createMatcher<T>(
  resolver: Function,
  fieldResolver: (ctx: T) => Generator,
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
