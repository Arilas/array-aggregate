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
    nullableNumber:
      Math.random() >= 0.5 ? Math.ceil(Math.random() * 1000) : null,
    nullableString: Math.random() >= 0.5 ? randomName() : null,
    nullableDate: Math.random() >= 0.5 ? randomDate() : null,
  }

  return data
}

function mapValue<T: Object, N: string>(
  name: N,
): (item: T) => $ElementType<T, N> {
  return item => item[name]
}

const data = Array.from(new Uint8Array(8).map(index => index)).map(
  makeRandomItem,
)

describe('numbers', () => {
  test('sort ASC', () => {
    const sort = buildSort({
      qty: 1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('qty')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous).toBeLessThan(current)
      }
      return current
    })
  })

  test('sort DESC', () => {
    const sort = buildSort({
      qty: -1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('qty')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous).toBeGreaterThan(current)
      }
      return current
    })
  })

  test('sort nullable ASC', () => {
    const sort = buildSort({
      nullableNumber: 1,
    })
    const sorted = data.slice().sort(sort)
    expect(sorted[0].nullableNumber).toBeNull()
    sorted.map(mapValue('nullableNumber')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous).toBeLessThan(current)
      }
      return current
    })
    expect(sorted[sorted.length - 1].nullableNumber).not.toBeNull()
  })

  test('sort nullable DESC', () => {
    const sort = buildSort({
      nullableNumber: -1,
    })
    const sorted = data.slice().sort(sort)
    expect(sorted[0].nullableNumber).not.toBeNull()
    sorted.map(mapValue('nullableNumber')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous).toBeGreaterThan(current)
      }
      return current
    })
    expect(sorted[sorted.length - 1].nullableNumber).toBeNull()
  })
})

describe('string', () => {
  test('sort ASC', () => {
    const sort = buildSort({
      name: 1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('name')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous.localeCompare(current)).toBe(-1)
      }
      return current
    })
  })

  test('sort DESC', () => {
    const sort = buildSort({
      name: -1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('name')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous.localeCompare(current)).toBe(1)
      }
      return current
    })
  })

  test('sort nullable ASC', () => {
    const sort = buildSort({
      nullableString: 1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('nullableString')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous.localeCompare(current)).toBe(-1)
      }
      return current
    })
  })

  test('sort nullable DESC', () => {
    const sort = buildSort({
      nullableString: -1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('nullableString')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous.localeCompare(current)).toBe(1)
      }
      return current
    })
  })
})

describe('date', () => {
  test('sort ASC', () => {
    const sort = buildSort({
      date: 1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('date')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous * 1).toBeLessThan(current * 1)
      }
      return current
    })
  })

  test('sort DESC', () => {
    const sort = buildSort({
      date: -1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('date')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous * 1).toBeGreaterThan(current * 1)
      }
      return current
    })
  })

  test('sort nullable ASC', () => {
    const sort = buildSort({
      nullableDate: 1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('nullableDate')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous * 1).toBeLessThan(current * 1)
      }
      return current
    })
  })

  test('sort nullable DESC', () => {
    const sort = buildSort({
      nullableDate: -1,
    })
    const sorted = data.slice().sort(sort)
    sorted.map(mapValue('nullableDate')).reduce((previous, current) => {
      if (previous != null && current != null) {
        expect(previous * 1).toBeGreaterThan(current * 1)
      }
      return current
    })
  })
})
