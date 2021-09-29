import { buildFilter } from '../../query/buildFilter'
import { Query } from '../../query/types'

export function elemMatch<
  T extends { [key: string]: any },
  K extends keyof T = keyof T,
  V extends T[K][0] = T[K] extends object[] ? T[K][0] : never,
>(key: K, query: Query<V>) {
  const matcher = buildFilter<V>(query)
  return <R extends { [key in K]: V[] }>(target: R, value: T) => {
    if (value.hasOwnProperty(key)) {
      const first = value[key].find(matcher.match)
      if (first) {
        // @ts-ignore
        target[key] = [first]
      }
    }
    return target
  }
}
