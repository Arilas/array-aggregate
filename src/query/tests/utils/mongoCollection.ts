import Monk, { ICollection } from 'monk'
import { faker } from '@faker-js/faker'

type FakeGetter<T extends { _id?: any }> = {
  _get(id: any): T
}

export async function wrapMongoCollection<T extends { _id?: any }>(
  data: Array<T>,
): Promise<ICollection<T> & FakeGetter<T>> {
  const map: { [key: string]: T } = data.reduce(
    (target, item) => Object.assign(target, { [item._id]: item }),
    {},
  )
  const dbName = faker.lorem.word()
  const collectionName = faker.lorem.word()
  const db = Monk(`localhost/${dbName}`)
  // await db
  const collection: ICollection<T> = db.get(collectionName)
  await collection.bulkWrite(
    // @ts-ignore
    data.map((item: T) => ({
      insertOne: {
        document: item,
      },
    })),
  )
  return Object.assign({}, collection, {
    _get(id: string) {
      return map[id]
    },
  })
}
