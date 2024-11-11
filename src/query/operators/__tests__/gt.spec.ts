import { it, expect, describe } from 'vitest'

import { gt } from '../gt.js'

const beginDate = new Date('2017-01-01')
const beginTimestamp = beginDate.getTime()
const endDate = new Date('2017-02-01')
const endTimestamp = endDate.getTime()

describe('gt', () => {
  it('should work with two dates', () => {
    expect(gt(beginDate)(endDate)).toBeTruthy()
    expect(gt(endDate)(beginDate)).toBeFalsy()
  })

  it('should work with date and string', () => {
    expect(gt(beginDate)('2017-02-01')).toBeTruthy()
    expect(gt(beginDate)('2017-01-01')).toBeFalsy()
  })

  it('should work with date and number', () => {
    expect(gt(beginDate)(endTimestamp)).toBeTruthy()
    expect(gt(beginDate)(beginTimestamp)).toBeFalsy()
  })

  it('should work with string and date', () => {
    expect(gt('2017-01-01')(endDate)).toBeTruthy()
    expect(gt('2017-02-01')(endDate)).toBeFalsy()
  })

  it('should work with string and string', () => {
    expect(gt('2017-01-01')('2017-02-01')).toBeTruthy()
    expect(gt('2017-02-01')('2017-02-01')).toBeFalsy()
  })

  it('should work with just a number', () => {
    expect(gt(1)(2)).toBeTruthy()
    expect(gt(1)(1)).toBeFalsy()
  })

  it('should work with just a string', () => {
    expect(gt('1')('2')).toBeTruthy()
    expect(gt('1')('1')).toBeFalsy()
  })
})
