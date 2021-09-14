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

it('Use the $nin Operator to Match Values', async () => {
  const result = await inventory.find({ qty: { $nin: [5, 15] } })
  expect(result).toHaveLength(4)
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
  expect(result[2]).toMatchObject({
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    tags: ['B', 'A'],
  })
  expect(result[3]).toMatchObject({
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  })
})

it('Use the $nin Operator to Match Values in an Array', async () => {
  const result = await inventory.find({
    tags: { $nin: ['appliances', 'school'] },
  })
  expect(result).toHaveLength(4)
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
  expect(result[2]).toMatchObject({
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    tags: ['B', 'A'],
  })
  expect(result[3]).toMatchObject({
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  })
})

it('Use the $nin Operator with a Regular Expression', async () => {
  const result = await inventory.find({ tags: { $nin: [/^be/, /^st/] } })
  expect(result).toHaveLength(3)
  expect(result[0]).toMatchObject({
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['school', 'clothing', 'C'],
  })
  expect(result[1]).toMatchObject({
    _id: 4,
    item: { name: 'xy', code: '456' },
    qty: 30,
    tags: ['B', 'A'],
  })
  expect(result[2]).toMatchObject({
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  })
})
