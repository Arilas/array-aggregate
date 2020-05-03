import { or } from './or'
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
