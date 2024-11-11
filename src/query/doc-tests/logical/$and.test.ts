import { it, expect } from 'vitest'
import { wrapCollection } from '../../../wrapCollection'

const inventory = wrapCollection([
  { _id: 1, item: { name: 'ab', code: '123' }, qty: 15, tags: ['A', 'B', 'C'] },
  {
    _id: 2,
    item: { name: 'cd', code: '123' },
    qty: 20,
    price: 1.99,
    tags: ['B'],
  },
  {
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    price: 5,
    tags: ['A', 'B'],
  },
  {
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    price: 0.99,
    tags: ['B', 'A'],
    sale: true,
  },
  {
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 15,
    price: 1.99,
    tags: [['A', 'B'], 'C'],
  },
])

it('AND Queries With Multiple Expressions Specifying the Same Field', async () => {
  const result = await inventory.find({
    $and: [{ price: { $ne: 1.99 } }, { price: { $exists: true } }],
  })
  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject(inventory._get(3))
  expect(result[1]).toMatchObject(inventory._get(4))
})

it('AND Queries With Multiple Expressions Specifying the Same Operator', async () => {
  const result = await inventory.find({
    $and: [
      { $or: [{ price: 0.99 }, { price: 1.99 }] },
      { $or: [{ sale: true }, { qty: { $lt: 20 } }] },
    ],
  })
  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject(inventory._get(4))
  expect(result[1]).toMatchObject(inventory._get(5))
})
