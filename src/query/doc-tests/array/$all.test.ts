import { it, expect } from 'vitest'

import { makeQueryFilter } from '../../../makeQueryFilter'

const ObjectId = (val: any) => val

interface TestObj {
  tags: string[] | (string[] | string)[]
}

it('Equivalent to and Operation', () => {
  const query1 = makeQueryFilter<TestObj>({
    tags: { $all: ['ssl', 'security'] },
  })
  const query2 = makeQueryFilter<TestObj>({
    $and: [{ tags: 'ssl' }, { tags: 'security' }],
  })
  const objPass = {
    tags: ['ssl', 'security'],
  }
  const toFail = [{}, { tags: ['ssl'] }, { tags: 'ssl' }, { tags: 1 }]
  expect(query1(objPass)).toBeTruthy()
  expect(query2(objPass)).toBeTruthy()
  for (const fail of toFail) {
    // @ts-ignore
    expect(query1(fail)).toBeFalsy()
    // @ts-ignore
    expect(query2(fail)).toBeFalsy()
  }
})

it('Nested Array', () => {
  const query1 = makeQueryFilter<TestObj>({
    tags: { $all: [['ssl', 'security']] },
  })
  const query2 = makeQueryFilter<TestObj>({
    $and: [{ tags: ['ssl', 'security'] }],
  })
  const query3 = makeQueryFilter<TestObj>({ tags: ['ssl', 'security'] })
  const toPass: TestObj[] = [
    {
      tags: [
        ['ssl', 'security'],
        ['ssl', 'sdfs'],
      ],
    },
    { tags: [['ssl', 'security'], 'sdd'] },
  ]
  const toFail = [
    {},
    { tags: ['ssl'] },
    { tags: 'ssl' },
    { tags: 1 },
    {
      tags: [['ssl'], 'security'],
    },
  ]
  for (const objPass of toPass) {
    expect(query1(objPass)).toBeTruthy()
    expect(query2(objPass)).toBeTruthy()
    expect(query3(objPass)).toBeTruthy()
  }
  expect(
    query1({
      tags: [
        ['ssl', 'sfs'],
        ['asdf', 'security'],
      ],
    }),
  ).toBeFalsy()
  const nestedCheck = {
    tags: ['ssl', 'security'],
  }
  expect(query1(nestedCheck)).toBeFalsy()
  expect(query2(nestedCheck)).toBeTruthy()
  expect(query3(nestedCheck)).toBeTruthy()
  for (const fail of toFail) {
    // @ts-ignore
    expect(query1(fail)).toBeFalsy()
    // @ts-ignore
    expect(query2(fail)).toBeFalsy()
    // @ts-ignore
    expect(query3(fail)).toBeFalsy()
  }
})

const inventory = [
  {
    _id: ObjectId('5234cc89687ea597eabee675'),
    code: 'xyz',
    tags: ['school', 'book', 'bag', 'headphone', 'appliance'],
    qty: [
      { size: 'S', num: 10, color: 'blue' },
      { size: 'M', num: 45, color: 'blue' },
      { size: 'L', num: 100, color: 'green' },
    ],
  },

  {
    _id: ObjectId('5234cc8a687ea597eabee676'),
    code: 'abc',
    tags: ['appliance', 'school', 'book'],
    qty: [
      { size: '6', num: 100, color: 'green' },
      { size: '6', num: 50, color: 'blue' },
      { size: '8', num: 100, color: 'brown' },
    ],
  },

  {
    _id: ObjectId('5234ccb7687ea597eabee677'),
    code: 'efg',
    tags: ['school', 'book'],
    qty: [
      { size: 'S', num: 10, color: 'blue' },
      { size: 'M', num: 100, color: 'blue' },
      { size: 'L', num: 100, color: 'green' },
    ],
  },

  {
    _id: ObjectId('52350353b2eff1353b349de9'),
    code: 'ijk',
    tags: ['electronics', 'school'],
    qty: [{ size: 'M', num: 100, color: 'green' }],
  },
]

it('Use $all to Match Values', () => {
  const query = makeQueryFilter<TestObj>({
    tags: { $all: ['appliance', 'school', 'book'] },
  })
  const result = inventory.filter(query)
  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject({
    _id: ObjectId('5234cc89687ea597eabee675'),
    code: 'xyz',
    tags: ['school', 'book', 'bag', 'headphone', 'appliance'],
    qty: [
      { size: 'S', num: 10, color: 'blue' },
      { size: 'M', num: 45, color: 'blue' },
      { size: 'L', num: 100, color: 'green' },
    ],
  })
  expect(result[1]).toMatchObject({
    _id: ObjectId('5234cc8a687ea597eabee676'),
    code: 'abc',
    tags: ['appliance', 'school', 'book'],
    qty: [
      { size: '6', num: 100, color: 'green' },
      { size: '6', num: 50, color: 'blue' },
      { size: '8', num: 100, color: 'brown' },
    ],
  })
})

it('Use $all with $elemMatch', () => {
  const query = makeQueryFilter<TestObj>({
    qty: {
      $all: [
        { $elemMatch: { size: 'M', num: { $gt: 50 } } },
        { $elemMatch: { num: 100, color: 'green' } },
      ],
    },
  })
  const result = inventory.filter(query)
  expect(result).toHaveLength(2)
})

it('$all non-array field', () => {
  const query1 = makeQueryFilter<TestObj>({ 'qty.num': { $all: [50] } })
  const query2 = makeQueryFilter<TestObj>({ 'qty.num': 50 })

  const result1 = inventory.filter(query1)
  const result2 = inventory.filter(query2)
  expect(result1).toHaveLength(1)
  expect(result2).toHaveLength(1)
  expect(result1[0]).toEqual(result2[0])
})
