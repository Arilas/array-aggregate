export type Pair<T extends any[], R> = [
  (...args: any[]) => boolean,
  (...args: T) => R,
]

export const T = () => true
export const F = () => false

export function cond<T extends any[], R>(
  pairs: Pair<T, R>[],
  elsewise?: Pair<T, R>[1],
) {
  return (...args: T) => {
    for (const [check, work] of pairs) {
      if (check(...args)) {
        return work(...args)
      }
    }
    if (elsewise) {
      return elsewise(...args)
    } else {
      throw new Error('Condition unmet')
    }
  }
}
