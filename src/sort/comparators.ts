import { detectType } from './detectType'
import { Ratio } from './Ratio'
import { Types } from './Types'

export const comparators = {
  [Types.Null]: (
    value1: null | undefined,
    value2: null | undefined,
    direction: Ratio,
  ) =>
    value1 === value2 ? Ratio.Same : value1 === null ? direction : -direction,
  [Types.Boolean]: (value1: boolean, value2: boolean, direction: Ratio) =>
    value1 === value2 ? Ratio.Same : value1 ? direction : -direction,
  [Types.Date]: (
    value1: Date | string,
    value2: Date | string,
    direction: Ratio,
  ) => {
    if (typeof value1 === 'string') {
      value1 = new Date(value1)
    }
    if (typeof value2 === 'string') {
      value2 = new Date(value2)
    }
    if (value1 > value2) {
      return direction
    } else if (value1 < value2) {
      return -direction
    }
    return 0
  },
  [Types.Number]: (value1: number, value2: number, direction: Ratio) => {
    if (value1 * 1 > value2 * 1) {
      return direction
    } else if (value1 * 1 < value2 * 1) {
      return -direction
    }
    return Ratio.Same
  },
  [Types.ObjectId]: (value1: number, value2: number, direction: Ratio) => {
    if (typeof value1 === 'string') {
      // MongoDB Ids is an number
      value1 = parseInt(value1, 16)
    }
    if (typeof value2 === 'string') {
      // MongoDB Ids is an number
      value2 = parseInt(value2, 16)
    }

    if (value1 * 1 > value2 * 1) {
      return direction
    } else if (value1 * 1 < value2 * 1) {
      return -direction
    }
    return Ratio.Same
  },
  [Types.String]: (value1: string, value2: string, direction: Ratio) => {
    const result = value1.localeCompare(value2)
    if (result !== 0) {
      return result == 1 ? direction : -direction
    }
    return Ratio.Same
  },
  [Types.Array]: (value1: any[], value2: any[], direction: Ratio): Ratio => {
    const smallest1 = findSmallestInArray(value1, direction)
    const smallest2 = findSmallestInArray(value2, direction)
    if (smallest1 === smallest2) {
      return Ratio.Same
    }
    const smallest1Type = detectType(smallest1)
    const smallest2Type = detectType(smallest2)
    if (smallest1Type === smallest2Type) {
      // @ts-ignore
      return comparators[smallest1Type](smallest1, smallest2, direction)
    }
    return smallest1Type > smallest2Type ? direction : -direction
  },
  [Types.Object]: (value1: object, value2: object, direction: Ratio): Ratio => {
    const fields = makeListOfColumns(value1, value2)
    for (const type of Object.keys(fields)) {
      // @ts-ignore
      for (const key of fields[type]) {
        if (!value1.hasOwnProperty(key)) {
          return -direction
        } else if (!value2.hasOwnProperty(key)) {
          return direction
        }
        // @ts-ignore
        const result: Ratio = comparators[type](
          // @ts-ignore
          value1[key],
          // @ts-ignore
          value2[key],
          direction,
        )
        if (result !== Ratio.Same) {
          return result
        }
      }
    }
    return Ratio.Same
  },
  [Types.RegEx]: (): Ratio => {
    return Ratio.Same
  },
}

interface KeysMap {
  [key: string]: string[]
}

export function makeListOfColumns(...objs: object[]) {
  const keysOnly = objs.map((item) => Object.keys(item))
  const maxItems = keysOnly.reduce(
    (target, keys) => (keys.length > target ? keys.length : target),
    0,
  )
  const result: KeysMap = {}

  for (let i = 0; i < maxItems; i++) {
    keysOnly.forEach((keys, index) => {
      const key = keys[i]
      if (objs[index].hasOwnProperty(key)) {
        // @ts-ignore
        const type = detectType(objs[index][key])
        if (!result.hasOwnProperty(type)) {
          result[type] = [key]
        }
        if (!result[type]?.includes(key)) {
          result[type]?.push(key)
        }
      }
    })
  }
  return result
}

export function findSmallestInArray(arr: any[], direction: Ratio) {
  return arr.reduce((target: any, item: any) => {
    if (item === target) {
      return target
    }
    const type = detectType(item)
    const typeTarget = detectType(target)
    if (type === typeTarget) {
      // @ts-ignore
      const result = comparators[type](item, target, direction)
      if (result === 0) {
        return target
      } else if (result === 1) {
        return item
      } else {
        return target
      }
    }
    if (direction == 1 && type > typeTarget) {
      return item
    } else if (direction == -1 && type < typeTarget) {
      return item
    }
    return target
  }, arr[0])
}
