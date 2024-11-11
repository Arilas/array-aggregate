import { it, expect, describe } from 'vitest'
import { nor } from '../nor.js'
import { Matcher } from '../../createMatcher.js'

const matchers: Matcher<{ foo?: string; bar?: string }>[] = [
  {
    match(ctx) {
      return ctx.foo === 'bar'
    },
  },
  {
    match(ctx) {
      return ctx.bar === 'foo'
    },
  },
]

describe('nor', () => {
  it('should match all conditions', () => {
    const matcher = nor(matchers)
    expect(
      matcher({
        foo: 'bar',
        bar: 'foo',
      }),
    ).toBeFalsy()
    expect(
      matcher({
        foo: 'bar',
      }),
    ).toBeFalsy()
    expect(matcher({})).toBeTruthy()
  })
})
