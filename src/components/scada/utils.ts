/**
 *  Merge two objects deeply, only overwriting properties that are not undefined
 *  @param target - The target object to merge into
 *  @param source - The source object to merge from
 *  @returns The merged object
 *  @example
 *  const target = { a: 1, b: { c: 2 } }
 *  const source = { b: { d: 3 }, e: 4 }
 *  const result = deepMerge(target, source)
 *  console.log(result) // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *  @description
 *  This function recursively merges two objects, overwriting properties in the target object
 *  with properties from the source object only if they are not undefined. It handles nested objects
 */

export function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) {
          target[key] = {} as T[typeof key]
        }
        deepMerge(target[key], source[key])
      } else {
        target[key] = source[key] as T[typeof key]
      }
    }
  }
  return target
}
