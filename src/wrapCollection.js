import { buildFilter } from './query/buildFilter'

export function wrapCollection(collection) {
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
