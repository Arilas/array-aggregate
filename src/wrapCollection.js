import { buildFilter } from './query/buildFilter'

export function wrapCollection(collection) {
  return {
    find(query) {
      return Promise.resolve(collection.filter(buildFilter(query).match))
    },
    schema(query) {
      return Promise.resolve(buildFilter(query).schema)
    },
  }
}
