import { it, expect, describe } from 'vitest'

import { gte } from '../gte.js'

const beginDate = new Date('2017-01-01')
const beginTimestamp = beginDate.getTime()
const endDate = new Date('2017-02-01')
const endTimestamp = endDate.getTime()

describe('gte', () => {
  it('should work with two dates', () => {
    console.log('beginDate', beginDate, beginTimestamp)
    expect(gte(beginDate)(endDate)).toBeTruthy()
    expect(gte(endDate)(beginDate)).toBeFalsy()
  })

  it('should work with date and string', () => {
    expect(gte(beginDate)('2017-02-01')).toBeTruthy()
    expect(gte(beginDate)('2017-01-01')).toBeTruthy()
    expect(gte(beginDate)('2016-01-01')).toBeFalsy()
  })

  it('should work with date and number', () => {
    expect(gte(beginDate)(endTimestamp)).toBeTruthy()
    expect(gte(beginDate)(beginTimestamp)).toBeTruthy()
    expect(gte(beginDate)(beginTimestamp - 1)).toBeFalsy()
  })

  it('should work with string and date', () => {
    expect(gte('2017-01-01')(endDate)).toBeTruthy()
    expect(gte('2017-02-01')(endDate)).toBeTruthy()
    expect(gte('2018-02-01')(endDate)).toBeFalsy()
  })

  it('should work with string and string', () => {
    expect(gte('2017-01-01')('2017-02-01')).toBeTruthy()
    expect(gte('2017-02-01')('2017-02-01')).toBeTruthy()
    expect(gte('2018-02-01')('2017-02-01')).toBeFalsy()
  })

  it('should work with just a number', () => {
    expect(gte(1)(2)).toBeTruthy()
    expect(gte(1)(1)).toBeTruthy()
    expect(gte(1)(0)).toBeFalsy()
  })

  it('should work with just a string', () => {
    expect(gte('1')('2')).toBeTruthy()
    expect(gte('1')('1')).toBeTruthy()
    expect(gte('1')('0')).toBeFalsy()
  })
})
