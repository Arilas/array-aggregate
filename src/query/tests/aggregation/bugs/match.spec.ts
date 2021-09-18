import { wrapCollection } from '../../../../wrapCollection'

interface TestObj {
  _id?: number | string
  a?: any
}

describe('query:tests:aggregation:bugs', () => {
  const coll = wrapCollection<TestObj>([])

  it('shouldPass', async () => {
    // No results.
    await coll.remove({})
    expect(await coll.find({})).toMatchObject([])

    await coll.insert({ _id: 0, a: 1 })
    await coll.insert({ _id: 1, a: 2 })
    await coll.insert({ _id: 2, a: 3 })

    // Empty query.
    expect(await coll.find({})).toMatchObject([
      { _id: 0, a: 1 },
      { _id: 1, a: 2 },
      { _id: 2, a: 3 },
    ])

    // Simple queries.
    expect(await coll.find({ a: 1 })).toMatchObject([{ _id: 0, a: 1 }])
    expect(await coll.find({ a: 2 })).toMatchObject([{ _id: 1, a: 2 }])
    expect(await coll.find({ a: { $gt: 1 } })).toMatchObject([
      { _id: 1, a: 2 },
      { _id: 2, a: 3 },
    ])
    expect(await coll.find({ a: { $lte: 2 } })).toMatchObject([
      { _id: 0, a: 1 },
      { _id: 1, a: 2 },
    ])
    expect(await coll.find({ a: { $in: [1, 3] } })).toMatchObject([
      { _id: 0, a: 1 },
      { _id: 2, a: 3 },
    ])

    // Regular expression.
    await coll.remove({})
    await coll.insert({ _id: 0, a: 'x' })
    await coll.insert({ _id: 1, a: 'yx' })
    expect(await coll.find({ a: /^x/ })).toMatchObject([{ _id: 0, a: 'x' }])
    expect(await coll.find({ a: /x/ })).toMatchObject([
      { _id: 0, a: 'x' },
      { _id: 1, a: 'yx' },
    ])

    // Dotted field.
    await coll.remove({})
    await coll.insert({ _id: 0, a: { b: 4 } })
    await coll.insert({ _id: 1, a: 2 })
    expect(
      await coll.find({
        'a.b': 4,
      }),
    ).toMatchObject([{ _id: 0, a: { b: 4 } }])

    // Value within an array.
    await coll.remove({})
    await coll.insert({ _id: 0, a: [1, 2, 3] })
    await coll.insert({ _id: 1, a: [2, 2, 3] })
    await coll.insert({ _id: 2, a: [2, 2, 2] })
    expect(await coll.find({ a: 3 })).toMatchObject([
      { _id: 0, a: [1, 2, 3] },
      { _id: 1, a: [2, 2, 3] },
    ])

    const objects = [
      { a: 5, b: 5, c: null },
      { a: 3, b: null, c: 8 },
      { a: null, b: 3, c: 9 },
      { a: 1, b: 2, c: 3 },
      { a: 2, c: 5 },
      { a: 3, b: 2 },
      { a: 4 },
      { b: 2, c: 4 },
      { b: 2 },
      { c: 6 },
    ]

    await coll.remove({})
    for (const doc of objects) {
      await coll.insert(doc)
    }
    expect(await coll.find({ a: { $exists: true } })).toMatchObject([
      { a: 5, b: 5, c: null },
      { a: 3, b: null, c: 8 },
      { a: null, b: 3, c: 9 },
      { a: 1, b: 2, c: 3 },
      { a: 2, c: 5 },
      { a: 3, b: 2 },
      { a: 4 },
    ])
    expect(await coll.find({ b: { $exists: false } })).toMatchObject([
      { a: 2, c: 5 },
      { a: 4 },
      { c: 6 },
    ])

    // Missing, null, $exists matching.
    await coll.remove({})
    await coll.insert({ _id: 0 })
    await coll.insert({ _id: 1, a: null })
    await coll.insert({ _id: 3, a: 0 })

    expect(
      await coll.find({
        a: null,
      }),
    ).toMatchObject([{ _id: 0 }, { _id: 1, a: null }])

    // expect(await coll.find({ a: { $exists: true } })).toMatchObject([])
    // expect(await coll.find({ a: { $exists: false } })).toMatchObject([])

    // $elemMatch
    await coll.remove({})
    await coll.insert({ _id: 0, a: [1, 2] })
    await coll.insert({ _id: 1, a: [1, 2, 3] })
    expect(
      await coll.find({
        a: { $elemMatch: { $gt: 1, $mod: [2, 1] } },
      }),
    ).toMatchObject([{ _id: 1, a: [1, 2, 3] }])

    await coll.remove({})
    await coll.insert({ _id: 0, a: [{ b: 1 }, { c: 2 }] })
    await coll.insert({ _id: 1, a: [{ b: 1, c: 2 }] })
    expect(
      await coll.find({
        a: { $elemMatch: { b: 1, c: 2 } },
      }),
    ).toMatchObject([{ _id: 1, a: [{ b: 1, c: 2 }] }])

    // $size
    await coll.remove({})
    await coll.insert({})
    await coll.insert({ _id: 0, a: null })
    await coll.insert({ _id: 1, a: [] })
    await coll.insert({ _id: 2, a: [1] })
    await coll.insert({ _id: 3, a: [1, 2] })
    expect(await coll.find({ a: { $size: 0 } })).toMatchObject([
      { _id: 1, a: [] },
    ])
    expect(await coll.find({ a: { $size: 1 } })).toMatchObject([
      { _id: 2, a: [1] },
    ])
    expect(await coll.find({ a: { $size: 2 } })).toMatchObject([
      { _id: 3, a: [1, 2] },
    ])

    await coll.remove({})
    await coll.insert({ _id: 0, a: 1 })
    await coll.insert({ _id: 1, a: 2 })
    await coll.insert({ _id: 2, a: 3 })

    // $and
    expect(
      await coll.find({
        $and: [{ a: 2 }, { _id: 1 }],
      }),
    ).toMatchObject([{ _id: 1, a: 2 }])
    expect(
      await coll.find({
        $and: [{ a: 1 }, { _id: 1 }],
      }),
    ).toMatchObject([])
    expect(
      await coll.find({
        $and: [
          { $or: [{ _id: 1 }, { a: 3 }] },
          { $or: [{ _id: 2 }, { a: 2 }] },
        ],
      }),
    ).toMatchObject([
      { _id: 1, a: 2 },
      { _id: 2, a: 3 },
    ])

    // $or
    expect(await coll.find({ $or: [{ _id: 0 }, { a: 3 }] })).toMatchObject([
      { _id: 0, a: 1 },
      { _id: 2, a: 3 },
    ])
  })
})
