export type Pair<T extends any[], R> = [
  (...args: T) => boolean,
  (...args: T) => R,
]

export function cond<T extends any[], R>(pairs: Pair<T, R>[]) {
  return (...args: T) => {
    for (const [check, work] of pairs) {
      if (check(...args)) {
        return work(...args)
      }
    }
  }
}
