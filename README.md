# array-aggregate - Mongo-like querying and filtration

[![CircleCI](https://circleci.com/gh/Arilas/array-aggregate.svg?style=svg)](https://circleci.com/gh/Arilas/array-aggregate)[![codecov](https://codecov.io/gh/Arilas/array-aggregate/branch/master/graph/badge.svg)](https://codecov.io/gh/Arilas/array-aggregate)


## Installation

```
yarn add array-aggregate
```

## Usage

```js
import { makeQueryFilter } from 'array-aggregate'

const filterFn = makeQueryFilter({
  tags: 'bar',
  'history.creator': 1 // User Id
})

console.log(filterFn.match({
  tags: ['foo', 'bar', 'etc'],
  history: [
    {
      creator: 0
    },
    {
      creator: 1
    }
  ]
})) // true

console.log(filterFn.match({
  tags: ['foo', 'etc'],
  history: [
    {
      creator: 0
    },
    {
      creator: 1
    }
  ]
})) // false

console.log(filterFn.match({
  tags: ['foo', 'bar', 'etc'],
  history: [
    {
      creator: 0
    }
  ]
})) // false
```

## Built-in operators

### $eq

Check that value is equal to some in query. Work with array, string, number, Date, boolean

### $gt

Check that value is greater than some in query. Work with number, Date

### $gte

Check that value is greater than or equal some in query. Work with number, Date

### $lt

Check that value is less than some in query. Work with number, Date

### $lte

Check that value is less than or equal some in query. Work with number, Date

### $ne

Check that value is not equal some in query. Work with array, string, number, Date, boolean

### $in

Check that value is a member of some in query. Work with array, string, number

### $nin

Check that value is not a member of some in query. Work with array, string, number

## Built-in logical Operators

### $and

Check that all matches are true

### $or

Check that at least one matches are true

### $nor

Check that all matches are false

### $not

Negotiate inner condition result

## Built-in element Operators

### $exists

If it's `true` we will check that needed field exists in object, if it's `false` we will check that needed field is not inside object

## Array Operators

## $all

Check that all elements from rule are present in value.

## $size

Check that array or string have needed length

## $elemMatch

Apply some rule to array elements

## Big query example

```js
import { makeQueryFilter } from 'array-aggregate'

const secondQuery = makeQueryFilter({
  foo: {
    $eq: 'bar',
    $exists: true
  },
  createdAt,
  ololo: {
    a: {
      $exists: false
    }
  },
  a: {
    b: {
      c: {
        $lte: 1
      }
    }
  },
  'a[0].b.c': { // We can use path for accesing fields with index selection if it's needed
    $gte: 1
  }
})

console.log(secondQuery.match({
  foo: ['bar', 'test'],
  createdAt,
  a: [{
    b: [{
      c: 1
    }]
  }]
})) // true

```