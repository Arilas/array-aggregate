export function exists(shouldExists: boolean) {
  return (value: any) =>
    shouldExists ? value !== undefined : value === undefined
}
