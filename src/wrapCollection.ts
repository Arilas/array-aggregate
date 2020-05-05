/* eslint-disable import/no-extraneous-dependencies */
import { v4 } from 'uuid'
import { InsertWriteOpResult, WriteOpResult } from 'mongodb'
import { buildFilter } from './query/buildFilter'
import { Query } from './query/types'

export type FakeCollection<T extends { _id?: string | number }> = {
  _get(id: T['_id']): T & { _id: T['_id'] }
  find(query: Query<T>): Promise<Array<T>>
  schema(query: Record<string, any>): Promise<Record<string, any> | undefined>
  drop(): Promise<any>
  insert(doc: T): Promise<InsertWriteOpResult<T & { _id: T['_id'] }>>
  remove(query: Query<T>): Promise<WriteOpResult>
}

export function wrapCollection<T extends { _id?: string | number }>(
  rawCollection: T[],
): FakeCollection<T> {
  let collection: T[] = JSON.parse(JSON.stringify(rawCollection))
  let map: { [key: string]: T & { _id: T['_id'] } } = collection.reduce(
    // @ts-ignore
    (target, item) => Object.assign(target, { [item._id]: item }),
    {},
  )
  return {
    _get(id) {
      // @ts-ignore
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
    insert(rawDoc: T) {
      const docRes: T & { _id: T['_id'] } = JSON.parse(JSON.stringify(rawDoc))
      if (!docRes.hasOwnProperty('_id')) {
        docRes._id = v4()
      }
      // @ts-ignore
      map[docRes._id] = docRes
      collection.push(docRes)
      return Promise.resolve({
        insertedCount: 1,
        ops: [docRes],
        insertedIds: { 0: docRes._id },
        connection: 'ok',
        result: { ok: 1, n: 0 },
      })
    },
    async remove(query) {
      // const itemsToRemove = await this.find(query)
      collection = collection.filter((item) => !buildFilter(query).match(item))
      map = collection.reduce(
        // @ts-ignore
        (target, item) => Object.assign(target, { [item._id]: item }),
        {},
      )
      return Promise.resolve({
        ops: [],
        connection: 'ok',
        result: { ok: 1, n: 0 },
      })
    },
  }
}
