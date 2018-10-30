/** @flow */
import { buildFilter } from './query/buildFilter'

export type FakeCollection<T: { _id: string | number }> = {
  _get(id: $ElementType<T, '_id'>): T,
  find(query: Object): Promise<Array<T>>,
  schema(query: Object): Promise<?Object>,
}

export function wrapCollection<T: { _id: string | number }>(
  collection: Array<T>,
): FakeCollection<T> {
  const map = collection.reduce(
    (target, item) => Object.assign(target, { [item._id]: item }),
    {},
  )
  return {
    _get(id) {
      return map[id]
    },
    find(query) {
      return Promise.resolve(collection.filter(buildFilter(query).match))
    },
    schema(query) {
      return Promise.resolve(buildFilter(query).schema)
    },
  }
}
