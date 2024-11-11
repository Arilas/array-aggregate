import { describe, it, expect } from 'vitest'

import { wrapCollection } from '../../../wrapCollection'

interface TestObj {
  _id?: number | string
  a?: any
}

describe('query:tests:core:all', () => {
  const coll = wrapCollection<TestObj>([])

  it('all', async () => {
    await coll.insert({ a: [1, 2, 3] })
    await coll.insert({ a: [1, 2, 4] })
    await coll.insert({ a: [1, 8, 5] })
    await coll.insert({ a: [1, 8, 6] })
    await coll.insert({ a: [1, 9, 7] })
    await coll.insert({ a: [] })
    await coll.insert({})

    expect(await coll.find({ a: { $all: [1] } })).toHaveLength(5)
    expect(await coll.find({ a: { $all: [1, 2] } })).toHaveLength(2)
    expect(await coll.find({ a: { $all: [1, 8] } })).toHaveLength(2)
    expect(await coll.find({ a: { $all: [1, 3] } })).toHaveLength(1)
    expect(await coll.find({ a: { $all: [2] } })).toHaveLength(2)
    expect(await coll.find({ a: { $all: [2, 3] } })).toHaveLength(1)
    expect(await coll.find({ a: { $all: [2, 1] } })).toHaveLength(2)

    await coll.insert({ a: [2, 2] })
    expect(await coll.find({ a: { $all: [2, 2] } })).toHaveLength(3)

    await coll.insert({ a: [[2]] })
    // TODO: WTF???
    // expect(await coll.find({ a: { $all: [2] } })).toHaveLength(3)

    await coll.insert({ a: [{ b: [10, 11] }, 11] })
    expect(await coll.find({ 'a.b': { $all: [10] } })).toHaveLength(1)
    expect(await coll.find({ a: { $all: [11] } })).toHaveLength(1)

    await coll.insert({ a: { b: [20, 30] } })
    expect(await coll.find({ 'a.b': { $all: [20] } })).toHaveLength(1)
    expect(await coll.find({ 'a.b': { $all: [20, 30] } })).toHaveLength(1)

    expect(await coll.find({ a: { $all: [1] } })).toHaveLength(5)
    expect(await coll.find({ a: { $all: [19] } })).toHaveLength(0)
    expect(await coll.find({ a: { $all: [] } })).toHaveLength(0)
  })
  it('all2', async () => {
    await coll.remove({})

    await coll.insert({ a: [{ x: 1 }, { x: 2 }] })
    await coll.insert({ a: [{ x: 2 }, { x: 3 }] })
    await coll.insert({ a: [{ x: 3 }, { x: 4 }] })

    expect(await coll.find({ 'a.x': { $in: [1] } })).toHaveLength(1)
    expect(await coll.find({ 'a.x': { $in: [2] } })).toHaveLength(2)

    expect(await coll.find({ 'a.x': { $in: [1, 2] } })).toHaveLength(2)
    expect(await coll.find({ 'a.x': { $in: [2, 3] } })).toHaveLength(3)
    expect(await coll.find({ 'a.x': { $in: [1, 3] } })).toHaveLength(3)

    expect(await coll.find({ 'a.x': { $all: [1, 2] } })).toHaveLength(1)
    expect(await coll.find({ 'a.x': { $all: [2, 3] } })).toHaveLength(1)
    expect(await coll.find({ 'a.x': { $all: [1, 3] } })).toHaveLength(0)
  })
})
