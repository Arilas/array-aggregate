import { it, expect, describe } from 'vitest'

import { lt } from '../lt.js'

const beginDate = new Date('2017-01-01')
const beginTimestamp = beginDate.getTime()
const endDate = new Date('2017-02-01')
const endTimestamp = endDate.getTime()

describe('lt', () => {
  it('should work with two dates', () => {
    expect(lt(beginDate)(endDate)).toBeFalsy()
    expect(lt(endDate)(beginDate)).toBeTruthy()
  })

  it('should work with date and string', () => {
    expect(lt(beginDate)('2017-02-01')).toBeFalsy()
    expect(lt(beginDate)('2017-01-01')).toBeFalsy()
    expect(lt(beginDate)('2016-01-01')).toBeTruthy()
  })

  it('should work with date and number', () => {
    expect(lt(beginDate)(endTimestamp)).toBeFalsy()
    expect(lt(beginDate)(beginTimestamp)).toBeFalsy()
    expect(lt(beginDate)(beginTimestamp - 1)).toBeTruthy()
  })

  it('should work with string and date', () => {
    expect(lt('2017-01-01')(endDate)).toBeFalsy()
    expect(lt('2017-02-01')(endDate)).toBeFalsy()
    expect(lt('2018-02-01')(endDate)).toBeTruthy()
  })

  it('should work with string and string', () => {
    expect(lt('2017-01-01')('2017-02-01')).toBeFalsy()
    expect(lt('2017-02-01')('2017-02-01')).toBeFalsy()
    expect(lt('2018-02-01')('2017-02-01')).toBeTruthy()
  })

  it('should work with just a number', () => {
    expect(lt(1)(2)).toBeFalsy()
    expect(lt(1)(1)).toBeFalsy()
    expect(lt(1)(0)).toBeTruthy()
  })

  it('should work with just a string', () => {
    expect(lt('1')('2')).toBeFalsy()
    expect(lt('1')('1')).toBeFalsy()
    expect(lt('1')('0')).toBeTruthy()
  })
})
