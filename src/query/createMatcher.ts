export type Matcher<T> = {
  match(this: void, ctx: T): boolean
  schema?: Record<string, any>
}

export type Match<T> = (value: T) => boolean

export function createMatcher<T>(
  resolver: (value: any) => boolean,
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

export function createAllMatcher<T>(
  resolver: (value: any) => boolean,
  fieldResolver: (ctx: T) => Generator,
): Matcher<T> {
  return {
    match(ctx) {
      const fields = []
      for (const field of fieldResolver(ctx)) {
        fields.push(field)
        if (resolver(field)) {
          return true
        }
      }

      return fields.length > 1 ? resolver(fields) : false
    },
  }
}
