export function fieldSelector(fieldDescription) {
  const parts = fieldDescription ? fieldDescription.split('.') : []
  return function*(ctx) {
    function* goDeep(current, [part, ...parts]) {
      if (!part) {
        yield current
        // if (Array.isArray(current)) {
        //   for (const item of current) {
        //     if (Array.isArray(item)) {
        //       yield* goDeep(item, [])
        //     }
        //   }
        // }
      } else if (part.indexOf('[') !== -1) {
        //TODO: Implement multiple arrays
        const [key, index] = part.replace(']', '').split('[')
        if (Array.isArray(current[key]) && current[key][parseInt(index)]) {
          yield* goDeep(current[key][parseInt(index)], parts)
        } else {
          yield undefined
        }
      } else if (Array.isArray(current[part]) && parts.length) {
        for (const item of current[part]) {
          yield* goDeep(item, parts)
        }
      } else if (!parts.length || !current.hasOwnProperty(part)) {
        yield current[part]
      } else {
        yield* goDeep(current[part], parts)
      }
    }
    yield* goDeep(ctx, parts)
  }
}
