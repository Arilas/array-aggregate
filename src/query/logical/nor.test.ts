import { nor } from './nor'
import { Matcher } from '../createMatcher'

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
