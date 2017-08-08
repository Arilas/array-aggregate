import { normalizeQuery } from './normalizeQuery'

const simpleQuery = {
  foo: 'bar',
  bar: {
    $exists: true,
    $ne: 'bar'
  },
  test: {
    $in: ['a', 'b', 'c']
  },
  some: {
    $elemMatch: {
      a: 'foo',
      b: {
        $in: ['aaaa']
      }
    }
  }
}

const formattedQuery = {
  "$and": [
    {
      "foo": {
        "$eq": "bar"
      }
    },
    {
      "bar": {
        "$and": [
          {
            "$exists": true
          },
          {
            "$ne": "bar"
          }
        ]
      }
    },
    {
      "test": {
        "$in": [
          "a", "b", "c"
        ]
      }
    },
    {
      "$and": [
        {
          "some.a": {
            "$eq": "foo"
          }
        },
        {
          "some.b": {
            "$in": ["aaaa"]
          }
        }
      ]
    }
  ]
}

it('should add logical operations', () => {
  const query = normalizeQuery(simpleQuery)
  expect(query).toMatchObject(formattedQuery)
})