import { or } from './or'

const matchers = [
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
