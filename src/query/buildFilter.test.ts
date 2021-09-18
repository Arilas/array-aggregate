import { buildFilterDev } from './buildFilter'
import { operatorsFlowDev } from './flows/operators'
import { Schema } from './utils/Schema'

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
      operatorsFlowDev('$and', [], schema, undefined)
      expect(schema).toHaveProperty('$and')
      expect(schema).toHaveProperty('$and.$_Val')
      expect(schema).toHaveProperty('$and.$_SchemaKey', '$and')
      expect(schema).toHaveProperty('$and.$_Matcher.match')
    })
  })
})

it('should work with simple schema', () => {
  const schema: Schema = {}
  const demoObj = {
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
  }
  const filterFn = buildFilterDev<typeof demoObj>(
    secondQuery,
    undefined,
    schema,
  )
  expect(schema).toHaveProperty('foo.$eq.$_Val', secondQuery.foo.$eq)
  expect(schema).toHaveProperty('foo.$eq.$_Field', 'foo')
  expect(schema).toHaveProperty('foo.$eq.$_SchemaKey', '$eq')
  // @ts-ignore
  expect(schema.foo.$eq.$_Matcher.match(demoObj)).toBeTruthy()
  expect(
    // @ts-ignore
    schema.foo.$eq.$_Matcher.match({
      ...demoObj,
      foo: ['test'],
    }),
  ).toBeFalsy()
  expect(schema).toHaveProperty('foo.$exists.$_Val', secondQuery.foo.$exists)
  expect(schema).toHaveProperty('foo.$exists.$_Field', 'foo')
  expect(schema).toHaveProperty('foo.$exists.$_SchemaKey', '$exists')
  // @ts-ignore
  expect(schema.foo.$exists.$_Matcher.match(demoObj)).toBeTruthy()
  expect(
    // @ts-ignore
    schema.foo.$exists.$_Matcher.match({
      ...demoObj,
      foo: undefined,
    }),
  ).toBeFalsy()
  // @ts-ignore
  expect(schema.foo.$_Matcher.match(demoObj)).toBeTruthy()
  expect(
    // @ts-ignore
    schema.foo.$_Matcher.match({
      ...demoObj,
      foo: ['test'],
    }),
  ).toBeFalsy()
  expect(
    // @ts-ignore
    schema.foo.$_Matcher.match({
      ...demoObj,
      foo: undefined,
    }),
  ).toBeFalsy()

  expect(filterFn.match(demoObj)).toBeTruthy()
})

it('should work with dates', () => {
  const filterFn = buildFilterDev<{ createdAt: string | Date }>({
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
