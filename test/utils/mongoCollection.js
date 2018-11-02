/** @flow */
import Monk, { type Collection, type Document } from 'monk'
import faker from 'faker'

type FakeGetter<T: Document> = $ReadOnly<{
  _get(id: any): T,
}>

export async function wrapMongoCollection<T: Document>(
  data: Array<T>,
): Promise<Collection<T> & FakeGetter<T>> {
  const map = data.reduce(
    (target, item) => Object.assign(target, { [item._id]: item }),
    {},
  )
  const dbName = faker.lorem.word()
  const collectionName = faker.lorem.word()
  const db = Monk(`localhost/${dbName}`)
  // await db
  const collection: Collection<T> = db.get(collectionName)
  await collection.bulkWrite(
    data.map(item => ({
      insertOne: {
        document: item,
      },
    })),
  )
  return Object.assign({}, collection, {
    _get(id) {
      return map[id]
    },
  })
}
