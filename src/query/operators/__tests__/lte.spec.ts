import { it, expect, describe } from 'vitest'

import { lte } from '../lte.js'

const beginDate = new Date('2017-01-01')
const beginTimestamp = beginDate.getTime()
const endDate = new Date('2017-02-01')
const endTimestamp = endDate.getTime()

describe('lte', () => {
  it('should work with two dates', () => {
    expect(lte(beginDate)(endDate)).toBeFalsy()
    expect(lte(endDate)(beginDate)).toBeTruthy()
  })

  it('should work with date and string', () => {
    expect(lte(beginDate)('2017-02-01')).toBeFalsy()
    expect(lte(beginDate)('2017-01-01')).toBeTruthy()
    expect(lte(beginDate)('2016-01-01')).toBeTruthy()
  })

  it('should work with date and number', () => {
    expect(lte(beginDate)(endTimestamp)).toBeFalsy()
    expect(lte(beginDate)(beginTimestamp)).toBeTruthy()
    expect(lte(beginDate)(beginTimestamp - 1)).toBeTruthy()
  })

  it('should work with string and date', () => {
    expect(lte('2017-01-01')(endDate)).toBeFalsy()
    expect(lte('2017-02-01')(endDate)).toBeTruthy()
    expect(lte('2018-02-01')(endDate)).toBeTruthy()
  })

  it('should work with string and string', () => {
    expect(lte('2017-01-01')('2017-02-01')).toBeFalsy()
    expect(lte('2017-02-01')('2017-02-01')).toBeTruthy()
    expect(lte('2018-02-01')('2017-02-01')).toBeTruthy()
  })

  it('should work with just a number', () => {
    expect(lte(1)(2)).toBeFalsy()
    expect(lte(1)(1)).toBeTruthy()
    expect(lte(1)(0)).toBeTruthy()
  })

  it('should work with just a string', () => {
    expect(lte('1')('2')).toBeFalsy()
    expect(lte('1')('1')).toBeTruthy()
    expect(lte('1')('0')).toBeTruthy()
  })
})
