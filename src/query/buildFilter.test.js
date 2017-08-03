import { buildFilter } from './buildFilter'
import { normalizeQuery } from './normalizeQuery'

const createdAt = new Date

const simpleQuery = {
  $and: [
    {
      foo: {
        $eq: 'bar'
      }
    },
    {
      createdAt: {
        $eq: createdAt
      }
    },
    {
      a: {
        b: {
          c: {
            $eq: 1
          }
        }
      }
    },
    {
      'a.b.c': {
        $eq: 1
      }
    }
  ]
}

const secondQuery = normalizeQuery({
  foo: {
    $eq: 'bar',
    $exists: true
  },
  createdAt,
  ololo: {
    a: {
      $exists: false
    }
  },
  a: {
    b: {
      c: {
        $lte: 1
      }
    }
  },
  'a.b.c': {
    $gte: 1
  }
})

it('should work with simple schema', () => {
  const filterFn = buildFilter(secondQuery)
  expect(filterFn.match({
    foo: ['bar', 'test'],
    createdAt,
    a: [{
      b: [{
        c: 1
      }]
    }]
  })).toBeTruthy()
})