import { all } from './all'

const beginDate = new Date('2017-01-01')
const endDate = new Date('2017-02-01')

it('should work with simple matching', () => {
  const matcher = all(['a', 'b'])
  expect(matcher(['a', 'b'])).toBeTruthy()
  expect(matcher(['b', 'a'])).toBeTruthy()
  expect(matcher(['a', 'b', 'c'])).toBeTruthy()
  expect(matcher(['a', 'c'])).toBeFalsy()
})

it('should work with dates', () => {
  const matcher = all([beginDate, endDate])
  expect(matcher([beginDate, endDate])).toBeTruthy()
  expect(matcher([endDate, beginDate])).toBeTruthy()
  expect(matcher([beginDate, endDate, new Date()])).toBeTruthy()
  expect(matcher([beginDate, 'c'])).toBeFalsy()

  expect(matcher([beginDate * 1, endDate * 1])).toBeTruthy()
  expect(matcher([endDate * 1, beginDate * 1])).toBeTruthy()
  expect(matcher([beginDate * 1, endDate * 1, new Date() * 1])).toBeTruthy()
})

it('should work with values in array', () => {
  const matcher = all(['a', 'b'])
  expect(matcher([['a'], ['b']])).toBeTruthy()
  expect(matcher([['a', 'b']])).toBeTruthy()
  expect(matcher([['a', 'b'], ['c']])).toBeTruthy()
  expect(matcher([['a'], ['c']])).toBeFalsy()

  const dateMatcher = all([beginDate, endDate])
  expect(dateMatcher([[beginDate], [endDate]])).toBeTruthy()
})

it('should work with Regex rule', () => {
  const matcher = all([new RegExp('A', 'i'), new RegExp('b', 'i')])
  expect(matcher(['a', 'b'])).toBeTruthy()
  expect(matcher(['a', 'B'])).toBeTruthy()
})