import { not } from './not'

const originMatcher = {
  match(ctx) {
    return ctx.foo === 'bar'
  },
}

it('should match all conditions', () => {
  const matcher = not(originMatcher)
  expect(
    matcher({
      foo: 'bar',
    }),
  ).toBeFalsy()
  expect(matcher({})).toBeTruthy()
})
