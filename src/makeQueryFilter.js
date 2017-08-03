import { buildFilter } from './query/buildFilter'
import { normalizeQuery } from './query/normalizeQuery'

export function makeQueryFilter(query) {
  return buildFilter(normalizeQuery(query))
}
