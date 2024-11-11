import { it, expect, describe } from 'vitest'

import { not } from '../not.js'
import { Matcher } from '../../createMatcher.js'

const originMatcher: Matcher<{ foo?: string }> = {
  match(ctx) {
    return ctx.foo === 'bar'
  },
}

describe('not', () => {
  it('should match all conditions', () => {
    const matcher = not(originMatcher)
    expect(
      matcher({
        foo: 'bar',
      }),
    ).toBeFalsy()
    expect(matcher({})).toBeTruthy()
  })
})
