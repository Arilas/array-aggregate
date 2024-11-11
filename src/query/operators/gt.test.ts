import { it, expect } from 'vitest'

import { gt } from './gt'

const beginDate = new Date('2017-01-01')
const endDate = new Date('2017-02-01')

it('should work with two dates', () => {
  expect(gt(beginDate)(endDate)).toBeTruthy()
})

it('should work with date and string', () => {
  expect(gt(beginDate)('2017-02-01')).toBeTruthy()
})
