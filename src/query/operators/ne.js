import { eq } from './eq'

export function ne(rule) {
  return value => !eq(rule)(value)
}
