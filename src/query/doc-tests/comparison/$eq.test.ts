/* eslint-disable @typescript-eslint/no-use-before-define */
/** @flow */
import { wrapCollection, FakeCollection } from '../../../wrapCollection'
import { wrapMongoCollection } from '../../tests/utils/mongoCollection'

// @ts-ignore
let collections: {
  fake: FakeCollection<typeof items[0]>
  real: FakeCollection<typeof items[0]>
} = {}

const items = [
  {
    _id: 1,
    item: { name: 'ab', code: '123' },
    qty: 15,
    tags: ['A', 'B', 'C'],
  },
  { _id: 2, item: { name: 'cd', code: '123' }, qty: 20, tags: ['B'] },
  { _id: 3, item: { name: 'ij', code: '456' }, qty: 25, tags: ['A', 'B'] },
  { _id: 4, item: { name: 'xy', code: '456' }, qty: 30, tags: ['B', 'A'] },
  {
    _id: 5,
    item: { name: 'mn', code: '000' },
    qty: 20,
    tags: [['A', 'B'], 'C'],
  },
]

beforeAll(async () => {
  collections = {
    fake: wrapCollection(items),
    // @ts-ignore
    real: await wrapMongoCollection(items),
  }
})

test.each(['fake', 'real'])(
  '[%s] Equals a Specified Value',
  // @ts-ignore
  async (item: 'fake' | 'real') => {
    const inventory = collections[item]
    const result1 = await inventory.find({ qty: { $eq: 20 } })
    const result2 = await inventory.find({ qty: 20 })
    expect(result1).toHaveLength(2)
    expect(result2).toHaveLength(2)
    expect(result1[0]).toMatchObject(inventory._get(2))
    expect(result1[1]).toMatchObject(inventory._get(5))
    expect(result2[0]).toMatchObject(inventory._get(2))
    expect(result2[1]).toMatchObject(inventory._get(5))
  },
)

test.each(['fake', 'real'])(
  '[%s] Field in Embedded Document Equals a Value',
  // @ts-ignore
  async (item: 'fake' | 'real') => {
    const inventory = collections[item]
    const result1 = await inventory.find({ 'item.name': { $eq: 'ab' } })
    const result2 = await inventory.find({ 'item.name': 'ab' })
    expect(result1).toHaveLength(1)
    expect(result2).toHaveLength(1)
    expect(result1[0]).toMatchObject(inventory._get(1))
    expect(result2[0]).toMatchObject(inventory._get(1))
  },
)

test.each(['fake', 'real'])(
  '[%s] Array Element Equals a Value',
  // @ts-ignore
  async (item: 'fake' | 'real') => {
    const inventory = collections[item]
    const result1 = await inventory.find({ tags: { $eq: 'B' } })
    const result2 = await inventory.find({ tags: 'B' })
    expect(result1).toHaveLength(4)
    expect(result2).toHaveLength(4)
    expect(result1[0]).toMatchObject(inventory._get(1))
    expect(result1[1]).toMatchObject(inventory._get(2))
    expect(result1[2]).toMatchObject(inventory._get(3))
    expect(result1[3]).toMatchObject(inventory._get(4))
    expect(result2[0]).toMatchObject(inventory._get(1))
    expect(result2[1]).toMatchObject(inventory._get(2))
    expect(result2[2]).toMatchObject(inventory._get(3))
    expect(result2[3]).toMatchObject(inventory._get(4))
  },
)

test.each(['fake', 'real'])(
  '[%s] Equals an Array Value',
  // @ts-ignore
  async (item: 'fake' | 'real') => {
    const inventory = collections[item]
    const result1 = await inventory.find({ tags: { $eq: ['A', 'B'] } })
    const result2 = await inventory.find({ tags: ['A', 'B'] })
    expect(result1).toHaveLength(2)
    expect(result2).toHaveLength(2)
    expect(result1[0]).toMatchObject(inventory._get(3))
    expect(result1[1]).toMatchObject(inventory._get(5))
    expect(result2[0]).toMatchObject(inventory._get(3))
    expect(result2[1]).toMatchObject(inventory._get(5))
  },
)

afterAll(async () => {
  collections.real && (await collections.real.drop())
})
