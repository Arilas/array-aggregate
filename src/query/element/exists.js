
export function exists(shouldExists) {
  return value => shouldExists ? value !== undefined : value === undefined
}