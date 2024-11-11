import { Query } from './query/types.js'
import { buildFilter } from './query/buildFilter.js'

export function makeQueryFilter<T extends object>(query: Query<T>) {
  return buildFilter<T>(query).match
}
