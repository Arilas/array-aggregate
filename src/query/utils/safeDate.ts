const startDate = 631141200000 // 1990-01-01

export enum DateResult {
  DateString = 'date-string',
  Timestamp = 'timestamp',
  Date = 'date',
  Number = 'number',
  Unknown = 'unknown',
}

const dateRegExps = [
  // ISO 8601
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/,
  // Date. Ex: 2021-01-01
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/,
  // Time. Ex: 23:59:59.999
  // /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/,
]

export function isDateString(date: string) {
  return dateRegExps.some((regExp) => regExp.test(date))
}

export function isSafeDate(value: any): [boolean, DateResult] {
  if (value instanceof Date) {
    return [true, DateResult.Date]
  }
  if (!['string', 'number'].includes(typeof value)) {
    return [false, DateResult.Unknown]
  }
  const valueAsNumber = parseFloat(value as string)
  if (typeof value === 'string') {
    const isDateStr = isDateString(value)
    if (isDateStr && !Number.isNaN(new Date(value).valueOf())) {
      return [true, DateResult.DateString]
    }
    if (!Number.isNaN(valueAsNumber)) {
      const isNumericDate = !Number.isNaN(new Date(value).valueOf())
      if (isNumericDate && valueAsNumber >= startDate) {
        return [true, DateResult.Timestamp]
      }
    }
  }
  if (typeof value === 'number') {
    if (value >= startDate) {
      return [true, DateResult.Number]
    }
  }
  return [false, DateResult.Unknown]
}

export function isAnyDate(value: any): boolean {
  return isSafeDate(value)[0]
}
