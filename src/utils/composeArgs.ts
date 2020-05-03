/* eslint-disable import/export */
type Func<A extends any[], B> = (...next: A) => B

export function composeArgs<A extends any[], B>(
  f0: Func<A, B>,
): (...ctx: A) => B
export function composeArgs<A extends any[], B extends any[], C>(
  f1: Func<B, C>,
  f0: Func<A, B>,
): (...ctx: A) => C
export function composeArgs<
  A extends any[],
  B extends any[],
  C extends any[],
  D
>(f2: Func<C, D>, f1: Func<B, C>, f0: Func<A, B>): (...ctx: A) => D
export function composeArgs<
  A extends any[],
  B extends any[],
  C extends any[],
  D extends any[],
  E
>(
  f3: Func<D, E>,
  f2: Func<C, D>,
  f1: Func<B, C>,
  f0: Func<A, B>,
): (...ctx: A) => E
export function composeArgs<
  A extends any[],
  B extends any[],
  C extends any[],
  D extends any[],
  E extends any[],
  F
>(
  f4: Func<E, F>,
  f3: Func<D, E>,
  f2: Func<C, D>,
  f1: Func<B, C>,
  f0: Func<A, B>,
): (...ctx: A) => F
// eslint-disable-next-line
export function composeArgs(...funcs: Func<any, any>[]) {
  return (...arg: any[]) =>
    funcs.reduceRight((composed, f) => f(...composed), arg) // eslint-disable-line
}
