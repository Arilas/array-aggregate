/* eslint-disable import/no-extraneous-dependencies */
import { v4 } from 'uuid'
import { InsertManyResult, DeleteResult, InferIdType } from 'mongodb'
import { buildFilter, buildFilterDev } from './query/buildFilter'
import { Query } from './query/types'

export type FakeCollection<T extends { _id?: string | number }> = {
  _get(id: T['_id']): T & { _id: T['_id'] }
  find(query: Query<T>): Promise<Array<T>>
  schema(query: Record<string, any>): Promise<Record<string, any> | undefined>
  drop(): Promise<any>
  insert(doc: T): Promise<InsertManyResult<T & { _id: T['_id'] }>>
  remove(query: Query<T>): Promise<DeleteResult>
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
      return Promise.resolve(buildFilterDev(query).schema)
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
        acknowledged: true,
        insertedCount: 1,
        insertedIds: { 0: docRes._id as InferIdType<T> },
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
        acknowledged: true,
        deletedCount: 1,
      })
    },
  }
}
