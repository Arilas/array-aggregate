import { it, expect } from 'vitest'
import { wrapCollection } from '../../../wrapCollection'

const inventory = wrapCollection([
  // Match
  {
    // contain the price field whose value is not equal to 1.99 and contain the sale field whose value is not equal to true
    _id: 1,
    item: { name: 'ab', code: '123' },
    price: 1,
    sale: false,
    qty: 15,
    tags: ['A', 'B', 'C'],
  },
  {
    // contain the price field whose value is not equal to 1.99 but do not contain the sale field
    _id: 2,
    item: { name: 'cd', code: '123' },
    qty: 20,
    price: 5,
    tags: ['B'],
  },
  {
    // do not contain the price field but contain the sale field whose value is not equal to true
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    sale: false,
    tags: ['A', 'B'],
  },
  {
    // do not contain the price field and do not contain the sale field
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    tags: ['B', 'A'],
  },
  // Do not match
  {
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 15,
    price: 1.99,
    sale: true,
    tags: [['A', 'B'], 'C'],
  },
  {
    _id: 6,
    item: { name: 'op', code: '000' },
    qty: 5,
    price: 1.99,
    tags: ['B'],
  },
  {
    _id: 7,
    item: { name: 'qr', code: '000' },
    qty: 10,
    sale: true,
    tags: ['A'],
  },
])

it('$nor Query with Two Expressions', async () => {
  const result = await inventory.find({
    $nor: [{ price: 1.99 }, { sale: true }],
  })
  expect(result).toHaveLength(4)
  expect(result[0]).toMatchObject(inventory._get(1))
  expect(result[1]).toMatchObject(inventory._get(2))
  expect(result[2]).toMatchObject(inventory._get(3))
  expect(result[3]).toMatchObject(inventory._get(4))
})
