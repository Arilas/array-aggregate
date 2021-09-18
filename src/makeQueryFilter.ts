import { Query } from './query/types'
import { buildFilter } from './query/buildFilter'

export function makeQueryFilter<T extends object>(query: Query<T>) {
  return buildFilter<T>(query).match
}
