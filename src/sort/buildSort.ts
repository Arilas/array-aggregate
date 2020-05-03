/** @flow */

type Query = {
  [key: string]: 1 | -1
}

const toString = Object.prototype.toString

const detectType = (value: any, key: string) => {
  if (key === '_id') {
    return 'objectId'
  }
  if (value == null) {
    return 'null'
  }
  if (typeof value === 'number') {
    return 'number'
  }
  if (typeof value === 'string') {
    return 'string'
  }
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  const str = toString.call(value)
  if (str === '[object Object]') {
    return 'object'
  }
  if (str === '[object Array]') {
    return 'array'
  }
  if (str === '[object Date]') {
    return 'date'
  }
  if (str === '[object RegExp]') {
    return 'regExp'
  }
  throw new Error(`Unsupported value type ${str}`)
}

export function buildSort(query: Query) {
  const queryKeys = Object.keys(query)
  return (obj1: Record<string, any>, obj2: Record<string, any>): number => {
    for (const key of queryKeys) {
      const direction = query[key]
      const greater = direction == 1 ? 1 : -1
      const less = direction == 1 ? -1 : 1
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        const value1 = obj1[key]
        const value2 = obj2[key]
        if (Object.is(value1, value2)) {
          continue
        } else {
          const type1 = detectType(value1, key)
          const type2 = detectType(value2, key)
          if (type1 !== type2) {
            if (type1 === 'null') {
              return less
            } else if (type2 === 'null') {
              return greater
            } else if (value1.toString() == value2.toString()) {
              continue
            } else if (value1.toString() > value2.toString()) {
              return greater
            } else {
              return less
            }
          } else {
            switch (type1) {
              case 'null':
                continue
              case 'boolean':
                if (value1 === value2) {
                  continue
                } else if (value1) {
                  return greater
                } else {
                  return less
                }
              case 'number':
              case 'date':
                if (value1 * 1 > value2 * 1) {
                  return greater
                } else if (value1 * 1 < value2 * 1) {
                  return less
                }
                break
              case 'string': {
                const result = value1.localeCompare(value2)
                if (result !== 0) {
                  return direction == 1 ? result : result * -1
                }
                continue
              }
              case 'array': {
                if (value1.length === value2.length) {
                  continue
                }
                break
              }
              default:
                continue
            }
          }
        }
      } else if (obj1.hasOwnProperty(key)) {
        return greater
      } else if (obj2.hasOwnProperty(key)) {
        return less
      } else {
        continue
      }
    }
    return 0
  }
}
