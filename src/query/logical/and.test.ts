import { it, expect } from 'vitest'
import { Matcher } from '../createMatcher'
import { and } from './and'

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
