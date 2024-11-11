import { it, expect, describe } from 'vitest'
import { or } from '../or.js'
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

describe('or', () => {
  it('should match all conditions', () => {
    const matcher = or(matchers)
    expect(
      matcher({
        foo: 'bar',
        bar: 'foo',
      }),
    ).toBeTruthy()
    expect(
      matcher({
        foo: 'bar',
      }),
    ).toBeTruthy()
    expect(matcher({})).toBeFalsy()
  })
})
