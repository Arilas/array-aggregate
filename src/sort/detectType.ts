import { Types } from './Types.js'

// eslint-disable-next-line @typescript-eslint/unbound-method
export const toString = Object.prototype.toString

export function isDate(_date: string) {
  const _regExp = new RegExp(
    '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$',
  )
  return _regExp.test(_date)
}

export function detectType(value: any, key: string | number | symbol = '') {
  if (key === '_id' || key === 'id') {
    return Types.ObjectId
  }
  if (value == null) {
    return Types.Null
  }
  if (typeof value === 'number') {
    return Types.Number
  }
  if (typeof value === 'string') {
    if (isDate(value)) {
      return Types.Date
    }
    return Types.String
  }
  if (typeof value === 'boolean') {
    return Types.Boolean
  }
  const str = toString.call(value)
  if (Array.isArray(value)) {
    return Types.Array
  }
  if (str === '[object Date]') {
    return Types.Date
  }
  if (str === '[object RegExp]') {
    return Types.RegEx
  }
  return Types.Object
}
