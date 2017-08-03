import { nor } from './nor'

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
  const matcher = nor(matchers)
  expect(matcher({
    foo: 'bar',
    bar: 'foo'
  })).toBeFalsy()
  expect(matcher({
    foo: 'bar'
  })).toBeFalsy()
  expect(matcher({})).toBeTruthy()
})