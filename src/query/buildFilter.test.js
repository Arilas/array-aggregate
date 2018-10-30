/** @flow */
import { buildFilter } from './buildFilter'

const createdAt = new Date()

const secondQuery = {
  foo: {
    $eq: 'bar',
    $exists: true,
  },
  createdAt,
  ololo: {
    a: {
      $exists: false,
    },
  },
  a: {
    b: {
      c: {
        $lte: 1,
      },
    },
  },
  'a.b.c': {
    $gte: 1,
  },
}

it('should work with simple schema', () => {
  const filterFn = buildFilter(secondQuery)
  expect(
    filterFn.match({
      foo: ['bar', 'test'],
      createdAt,
      a: [
        {
          b: [
            {
              c: 1,
            },
          ],
        },
      ],
    }),
  ).toBeTruthy()
})

it('should work with dates', () => {
  const filterFn = buildFilter({
    createdAt: {
      $gte: new Date('2017-01-01'),
    },
  })
  expect(
    filterFn.match({
      createdAt: '2017-02-01T21:00:00Z',
    }),
  ).toBeTruthy()
})
