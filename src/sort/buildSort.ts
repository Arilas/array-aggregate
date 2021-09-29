import { comparators } from './comparators'
import { detectType } from './detectType'
import { Ratio } from './Ratio'
import { Types } from './Types'

export type Sort<T> = {
  [key in keyof T]: Ratio
}

export function buildSort<T extends object>(query: Sort<T>) {
  // @ts-ignore
  const queryKeys: (keyof T)[] = Object.keys(query)
  return (obj1: T, obj2: T): number => {
    for (const key of queryKeys) {
      const direction = query[key]
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        const value1 = obj1[key]
        const value2 = obj2[key]
        if (Object.is(value1, value2)) {
          continue
        } else {
          const type1 = detectType(value1, key)
          const type2 = detectType(value2, key)
          if (type1 !== type2) {
            if (type1 === Types.Array || type2 === Types.Array) {
              const result = comparators[Types.Array](
                Array.isArray(value1) ? value1 : [value1],
                Array.isArray(value2) ? value2 : [value2],
                direction,
              )
              if (result !== Ratio.Same) {
                return result
              }
            } else {
              return type1 > type2 ? direction : -direction
            }
          } else {
            // @ts-ignore
            const result = comparators[type1](value1, value2, direction)
            if (result !== Ratio.Same) {
              return result
            }
          }
        }
      } else if (obj1.hasOwnProperty(key)) {
        return direction
      } else if (obj2.hasOwnProperty(key)) {
        return -direction
      } else {
        continue
      }
    }
    return 0
  }
}
