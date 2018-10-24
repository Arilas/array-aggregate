import { wrapCollection } from '../../../wrapCollection'

const inventory = wrapCollection([
  { _id: 1, item: { name: 'ab', code: '123' }, qty: 15, tags: ['A', 'B', 'C'] },
  { _id: 2, item: { name: 'cd', code: '123' }, qty: 20, tags: ['B'] },
  { _id: 3, item: { name: 'ij', code: '456' }, qty: 25, tags: ['A', 'B'] },
  { _id: 4, item: { name: 'xy', code: '456' }, qty: 30, tags: ['B', 'A'] },
  {
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  },
])

it('Equals a Specified Value', async () => {
  const result1 = await inventory.find({ qty: { $eq: 20 } })
  const result2 = await inventory.find({ qty: 20 })
  expect(result1).toHaveLength(2)
  expect(result2).toHaveLength(2)
  expect(result1[0]).toMatchObject({
    _id: 2,
    item: { name: 'cd', code: '123' },
    qty: 20,
    tags: ['B'],
  })
  expect(result1[1]).toMatchObject({
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  })
})

it('Field in Embedded Document Equals a Value', async () => {
  const result1 = await inventory.find({ 'item.name': { $eq: 'ab' } })
  const result2 = await inventory.find({ 'item.name': 'ab' })
  expect(result1).toHaveLength(1)
  expect(result2).toHaveLength(1)
  expect(result1[0]).toMatchObject({
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['A', 'B', 'C'],
  })
})

it('Array Element Equals a Value', async () => {
  const result1 = await inventory.find({ tags: { $eq: 'B' } })
  const result2 = await inventory.find({ tags: 'B' })
  expect(result1).toHaveLength(4)
  expect(result2).toHaveLength(4)
  expect(result1[0]).toMatchObject({
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['A', 'B', 'C'],
  })
  expect(result1[1]).toMatchObject({
    _id: 2,
    item: { name: 'cd', code: '123' },
    qty: 20,
    tags: ['B'],
  })
  expect(result1[2]).toMatchObject({
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    tags: ['A', 'B'],
  })
  expect(result1[3]).toMatchObject({
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    tags: ['B', 'A'],
  })
})

it.skip('Equals an Array Value', async () => {
  const result1 = await inventory.find({ tags: { $eq: ['A', 'B'] } })
  const result2 = await inventory.find({ tags: ['A', 'B'] })
  expect(result1).toHaveLength(2)
  expect(result2).toHaveLength(2)
  expect(result1[0]).toMatchObject({
    _id: 3,
    item: { name: 'ij', code: '456' },
    qty: 25,
    tags: ['A', 'B'],
  })
  expect(result1[1]).toMatchObject({
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  })
})
