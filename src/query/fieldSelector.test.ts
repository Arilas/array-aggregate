import { fieldSelector } from './fieldSelector'

const simpleState = {
  foo: 'bar',
  bar: {
    foo2: 1,
    bar2: 2,
  },
  a: {
    e: 1,
    b: {
      e: 2,
      c: {
        e: 3,
        d: {
          e: 4,
        },
      },
    },
  },
  b: [
    {
      e: 1,
    },
    {
      e: 2,
    },
    {
      e: 3,
    },
  ],
}

it('should select value from context by simple name', () => {
  const resolver = fieldSelector('foo')
  let count = 0
  for (const item of resolver(simpleState)) {
    expect(item).toBe(simpleState.foo)
    count++
  }
  expect(count).toBe(1)
})

it('should select value from context by path', () => {
  const resolver = fieldSelector('bar.foo2')
  let count = 0
  for (const item of resolver(simpleState)) {
    expect(item).toBe(simpleState.bar.foo2)
    count++
  }
  expect(count).toBe(1)
})

it('should select value from context by path with array index', () => {
  const resolver = fieldSelector('b[0].e')
  let count = 0
  for (const e of resolver(simpleState)) {
    count++
    expect(e).toBe(count)
  }
  expect(count).toBe(1)

  const resolver2 = fieldSelector('b[0]')
  let count2 = 0
  for (const obj of resolver2(simpleState)) {
    count2++
    expect(obj).toBe(simpleState.b[0])
  }
  expect(count2).toBe(1)
})

it('should select value from context by path with object value inside array', () => {
  const resolver = fieldSelector('b.e')
  let count = 0
  for (const e of resolver(simpleState)) {
    count++
    expect(e).toBe(count)
  }
  expect(count).toBe(3)

  const resolver2 = fieldSelector('b')
  let count2 = 0
  for (const obj of resolver2(simpleState)) {
    count2++
    expect(obj).toBe(simpleState.b)
  }
  expect(count2).toBe(1)
})
