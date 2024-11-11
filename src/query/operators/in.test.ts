import { it, expect } from 'vitest'
import { inFn } from './in.js'

const beginFnDate = new Date('2017-01-01')
const endDate = new Date('2017-02-01')

it('should work with simple matchinFng', () => {
  const matcher = inFn(['a', 'b'])
  expect(matcher(['a', 'b'])).toBeTruthy()
  expect(matcher(['b', 'a'])).toBeTruthy()
  expect(matcher(['a', 'b', 'c'])).toBeTruthy()
  expect(matcher(['a', 'c'])).toBeTruthy()
  expect(matcher(['c'])).toBeFalsy()
})

it('should work with dates', () => {
  const matcher = inFn([beginFnDate, endDate])
  expect(matcher([beginFnDate, endDate])).toBeTruthy()
  expect(matcher([endDate, beginFnDate])).toBeTruthy()
  expect(matcher([beginFnDate, endDate, new Date()])).toBeTruthy()
  expect(matcher([beginFnDate, 'c'])).toBeTruthy()
  expect(matcher([new Date()])).toBeFalsy()

  expect(matcher([beginFnDate.valueOf(), endDate.valueOf()])).toBeTruthy()
  expect(matcher([endDate.valueOf(), beginFnDate.valueOf()])).toBeTruthy()
  expect(
    matcher([beginFnDate.valueOf(), endDate.valueOf(), new Date().valueOf()]),
  ).toBeTruthy()
  expect(matcher([new Date().valueOf()])).toBeFalsy()
})

it('should work with values inFn array', () => {
  const matcher = inFn(['a', 'b'])
  expect(matcher([['a'], ['b']])).toBeTruthy()
  expect(matcher([['a', 'b']])).toBeTruthy()
  expect(matcher([['a', 'b'], ['c']])).toBeTruthy()
  expect(matcher([['a'], ['c']])).toBeTruthy()
  expect(matcher([['c']])).toBeFalsy()

  const dateMatcher = inFn([beginFnDate, endDate])
  expect(dateMatcher([[beginFnDate], [endDate]])).toBeTruthy()
})

it('should work with Regex rule', () => {
  const matcher = inFn([new RegExp('A', 'i'), new RegExp('b', 'i')])
  expect(matcher(['a', 'b'])).toBeTruthy()
  expect(matcher(['a', 'B'])).toBeTruthy()
  expect(matcher(['c'])).toBeFalsy()
  expect(matcher(['C'])).toBeFalsy()
})
