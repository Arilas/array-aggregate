import { it, expect } from 'vitest'

import { not } from './not'
import { Matcher } from '../createMatcher'

const originMatcher: Matcher<{ foo?: string }> = {
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
