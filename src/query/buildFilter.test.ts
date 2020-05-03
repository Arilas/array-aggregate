/** @flow */
import { buildFilter, operatorsFlow } from './buildFilter'

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

describe('query:buildFilter', () => {
  describe('operatorsFlow', () => {
    it('should work with logical operators', () => {
      const schema = {}
      console.log(operatorsFlow('$and', [], schema), schema)
      expect(schema).toHaveProperty('$and')
      expect(schema).toHaveProperty('$and.$_Val')
      expect(schema).toHaveProperty('$and.$_SchemaKey', '$and')
      expect(schema).toHaveProperty('$and.$_Matcher.match')
      throw new Error()
    })
  })
})

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
