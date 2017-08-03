import { normalizeQuery } from './normalizeQuery'

const simpleQuery = {
  foo: 'bar',
  bar: {
    $exists: true,
    $ne: 'bar'
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
    }
  ]
}

it('should add logical operations', () => {
  const query = normalizeQuery(simpleQuery)
  expect(query).toMatchObject(formattedQuery)
})