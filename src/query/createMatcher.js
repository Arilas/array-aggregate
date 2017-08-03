
export function createLogicalMatcher(resolver) {
  return {
    match(ctx) {
      return resolver(ctx)
    }
  }
}

export function createMatcher(resolver, fieldResolver) {

  return {
    match(ctx) {
      for (const field of fieldResolver(ctx)) {
        if (resolver(field)) {
          return true
        }
      }

      return false
    }
  }
}