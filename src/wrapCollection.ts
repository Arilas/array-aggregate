/** @flow */
import { buildFilter } from './query/buildFilter'

export type FakeCollection<T extends { _id: string | number }> = {
  _get(id: T['_id']): T
  find(query: Record<string, any>): Promise<Array<T>>
  schema(query: Record<string, any>): Promise<Record<string, any> | undefined>
  drop(): Promise<any>
}

export function wrapCollection<T extends { _id: string | number }>(
  collection: T[],
): FakeCollection<T> {
  const map: { [key: string]: T } = collection.reduce(
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
    drop() {
      return Promise.resolve()
    },
  }
}
