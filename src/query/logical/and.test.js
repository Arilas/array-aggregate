import { and } from './and'

const matchers = [
  {
    match(ctx) {
      return ctx.foo === 'bar'
    }
  },
  {
    match(ctx) {
      return ctx.bar === 'foo'
    }
  }
]

it('should match all conditions', () => {
  const matcher = and(matchers)
  expect(matcher({
    foo: 'bar',
    bar: 'foo'
  })).toBeTruthy()
  expect(matcher({
    foo: 'bar'
  })).toBeFalsy()
  expect(matcher({})).toBeFalsy()
})