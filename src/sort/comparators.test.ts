import { describe, it } from '@jest/globals'
import { comparators } from './comparators'
import { Ratio } from './Ratio'
import { Types } from './Types'

describe('comparators', () => {
  it('should compare null/undefined', () => {
    expect(comparators[Types.Null](null, undefined, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Null](null, undefined, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Null](null, null, Ratio.Greater)).toBe(Ratio.Same)
    expect(comparators[Types.Null](undefined, undefined, Ratio.Greater)).toBe(
      Ratio.Same,
    )
  })
  it('should compare booleans', () => {
    expect(comparators[Types.Boolean](true, false, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Boolean](true, false, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Boolean](true, true, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.Boolean](false, false, Ratio.Greater)).toBe(
      Ratio.Same,
    )
  })
  it('shoud compare dates', () => {
    const first = new Date()
    const second = new Date()
    first.setSeconds(5)
    second.setSeconds(45)
    expect(comparators[Types.Date](first, second, Ratio.Greater)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Date](first, second, Ratio.Less)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Date](first, first, Ratio.Less)).toBe(Ratio.Same)
    expect(
      comparators[Types.Date](
        first.toISOString(),
        second.toISOString(),
        Ratio.Greater,
      ),
    ).toBe(Ratio.Falsy)
    expect(
      comparators[Types.Date](
        first.toISOString(),
        second.toISOString(),
        Ratio.Less,
      ),
    ).toBe(Ratio.Truthy)
    expect(
      comparators[Types.Date](
        first.toISOString(),
        first.toISOString(),
        Ratio.Less,
      ),
    ).toBe(Ratio.Same)
  })

  it('should compare numbers', () => {
    expect(comparators[Types.Number](10, 5, Ratio.Greater)).toBe(Ratio.Truthy)
    expect(comparators[Types.Number](10, 5, Ratio.Less)).toBe(Ratio.Falsy)
    expect(comparators[Types.Number](10, 10, Ratio.Greater)).toBe(Ratio.Same)
    expect(comparators[Types.Number](10, 10, Ratio.Less)).toBe(Ratio.Same)
  })

  it('should compare strings', () => {
    const first = 'bbb'
    const second = 'aaa'
    expect(comparators[Types.String](first, second, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.String](first, second, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.String](first, first, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.String](first, first, Ratio.Less)).toBe(Ratio.Same)
  })
  it('should compare arrays', () => {
    const first = [1, 2, 10]
    const second = [2, 8]
    expect(comparators[Types.Array](first, second, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Array](first, second, Ratio.Less)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Array](first, first, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.Array](first, first, Ratio.Less)).toBe(Ratio.Same)
  })
  it('should compare objects', () => {
    const first = {
      someVal: 20,
    }
    const second = {
      someVal: 1,
    }
    expect(comparators[Types.Object](first, second, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Object](first, second, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Object](first, first, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.Object](first, first, Ratio.Less)).toBe(Ratio.Same)
    const first2 = {
      name: 'BBBB',
    }
    const second2 = {
      name: 'AAAA',
    }
    expect(comparators[Types.Object](first2, second2, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Object](first2, second2, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Object](first2, first2, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.Object](first2, first2, Ratio.Less)).toBe(
      Ratio.Same,
    )
    const first3 = {
      name: 'BBBB',
    }
    const second3 = {}
    expect(comparators[Types.Object](first3, second3, Ratio.Greater)).toBe(
      Ratio.Truthy,
    )
    expect(comparators[Types.Object](first3, second3, Ratio.Less)).toBe(
      Ratio.Falsy,
    )
    expect(comparators[Types.Object](first3, first3, Ratio.Greater)).toBe(
      Ratio.Same,
    )
    expect(comparators[Types.Object](first3, first3, Ratio.Less)).toBe(
      Ratio.Same,
    )
  })
})
