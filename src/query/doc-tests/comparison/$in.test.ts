import { it, expect } from 'vitest'
import { wrapCollection } from '../../../wrapCollection'

const inventory = wrapCollection([
  {
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['school', 'clothing', 'C'],
  },
  { _id: 2, item: { name: 'cd', code: '123' }, qty: 20, tags: ['best'] },
  {
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    tags: ['starting-kit', 'B'],
  },
  { _id: 4, item: { name: 'xy', code: '456' }, qty: 30, tags: ['B', 'A'] },
  {
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  },
])

it('Use the $in Operator to Match Values', async () => {
  const result = await inventory.find({ qty: { $in: [5, 15] } })
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['school', 'clothing', 'C'],
  })
})

it('Use the $in Operator to Match Values in an Array', async () => {
  const result = await inventory.find({
    tags: { $in: ['appliances', 'school'] },
  })
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['school', 'clothing', 'C'],
  })
})

it('Use the $in Operator with a Regular Expression', async () => {
  const result = await inventory.find({ tags: { $in: [/^be/, /^st/] } })
  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject({
    _id: 2,
    item: { name: 'cd', code: '123' },
    qty: 20,
    tags: ['best'],
  })
  expect(result[1]).toMatchObject({
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    tags: ['starting-kit', 'B'],
  })
})
