import { it, expect, describe } from 'vitest'
import { Matcher } from '../../createMatcher.js'
import { and } from '../and.js'

type Ctx = {
  foo?: string
  bar?: string
}

const matchers: Array<Matcher<Ctx>> = [
  {
    match(ctx: Ctx) {
      return ctx.foo === 'bar'
    },
  },
  {
    match(ctx: Ctx) {
      return ctx.bar === 'foo'
    },
  },
]

describe('and', () => {
  it('should match all conditions', () => {
    const matcher = and(matchers)
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
    ).toBeFalsy()
    expect(matcher({})).toBeFalsy()
  })
})
