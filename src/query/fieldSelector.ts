export type FieldSelector = Generator<any, void, void>

export interface ContextType {
  [key: string]: any
}

export function fieldSelector(
  fieldDescription?: string,
): (ctx: ContextType) => FieldSelector {
  const parts = fieldDescription ? fieldDescription.split('.') : []
  return function* (ctx) {
    function* goDeep(current: any, [part, ...parts]: string[]): any {
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
        const idx = parseInt(index, 10)
        const potentialArray =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (current && key in current ? current[key] : undefined) as
            | any[]
            | undefined
        if (
          key in current &&
          Array.isArray(potentialArray) &&
          potentialArray[idx]
        ) {
          yield* goDeep(potentialArray[idx], parts)
        } else {
          yield undefined
        }
      } else if (
        typeof current === 'object' &&
        part in current &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Array.isArray(current[part]) &&
        parts.length
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (const item of current[part]) {
          yield* goDeep(item, parts)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      } else if (!parts.length || !current.hasOwnProperty(part)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        yield current[part]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        yield* goDeep(current[part], parts)
      }
    }
    yield* goDeep(ctx, parts)
  }
}
