import { buildFilter } from './query/buildFilter'
import { normalizeQuery } from './query/normalizeQuery'

export function makeQueryFilter(query, debug) {
  debug && console.log('Origin', JSON.stringify(query))
  const normalized = normalizeQuery(query, debug)
  debug && console.log('Result', JSON.stringify(normalized))
  return buildFilter(normalized)
}
