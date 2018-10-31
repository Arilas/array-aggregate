/** @flow */
import { buildSort } from './buildSort'

let id = 0

const randomName = () =>
  String.fromCharCode(
    Math.ceil(Math.random() * 25 + 97),
    Math.ceil(Math.random() * 25 + 97),
    Math.ceil(Math.random() * 25 + 97),
  )

const randomDate = () =>
  new Date(
    Math.ceil(Math.random() * 18) + 2000,
    Math.ceil(Math.random() * 11) + 1,
    Math.ceil(Math.random() * 28) + 1,
  )

const makeRandomItem = () => {
  const data = {
    _id: ++id,
    name: randomName(),
    qty: Math.ceil(Math.random() * 1000),
    date: randomDate(),
  }
  if (Math.random() > 0.5) {
    data.nullable = null
  } else {
    data.nullable = randomName()
  }
  return data
}
const data = Array.from(new Uint8Array(8).map(index => index)).map(
  makeRandomItem,
)

test('sort numbers ASC', () => {
  const sort = buildSort({
    qty: 1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].qty).toBeLessThan(sorted[sorted.length - 1].qty)
})

test('sort numbers DESC', () => {
  const sort = buildSort({
    qty: -1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].qty).toBeGreaterThan(sorted[sorted.length - 1].qty)
})

test('sort date ASC', () => {
  const sort = buildSort({
    date: 1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].date * 1).toBeLessThan(sorted[sorted.length - 1].date * 1)
})

test('sort date DESC', () => {
  const sort = buildSort({
    date: -1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].date * 1).toBeGreaterThan(sorted[sorted.length - 1].date * 1)
})

test('sort string ASC', () => {
  const sort = buildSort({
    name: 1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].name.localeCompare(sorted[sorted.length - 1].name)).toBe(-1)
})

test('sort string DESC', () => {
  const sort = buildSort({
    name: -1,
  })
  const sorted = data.slice().sort(sort)
  expect(sorted[0].name.localeCompare(sorted[sorted.length - 1].name)).toBe(1)
})
