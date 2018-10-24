import { makeQueryFilter } from '../../../makeQueryFilter'

it('Element Match', () => {
  const scores = [
    { _id: 1, results: [82, 85, 88] },
    { _id: 2, results: [75, 88, 89] },
  ]
  const query = makeQueryFilter({
    results: { $elemMatch: { $gte: 80, $lt: 85 } },
  })
  const result = scores.filter(query.match)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({ _id: 1, results: [82, 85, 88] })
})
const survey = [
  {
    _id: 1,
    results: [{ product: 'abc', score: 10 }, { product: 'xyz', score: 5 }],
  },
  {
    _id: 2,
    results: [{ product: 'abc', score: 8 }, { product: 'xyz', score: 7 }],
  },
  {
    _id: 3,
    results: [{ product: 'abc', score: 7 }, { product: 'xyz', score: 8 }],
  },
]

it('Array of Embedded Documents', () => {
  const query = makeQueryFilter({
    results: { $elemMatch: { product: 'xyz', score: { $gte: 8 } } },
  })
  const result = survey.filter(query.match)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    _id: 3,
    results: [{ product: 'abc', score: 7 }, { product: 'xyz', score: 8 }],
  })
})

it('Single Query Condition', () => {
  const query1 = makeQueryFilter({
    results: { $elemMatch: { product: 'xyz' } },
  })
  const query2 = makeQueryFilter({ 'results.product': 'xyz' })
  const result1 = survey.filter(query1.match)
  const result2 = survey.filter(query2.match)
  expect(result1).toHaveLength(3)
  expect(result2).toHaveLength(3)
})
