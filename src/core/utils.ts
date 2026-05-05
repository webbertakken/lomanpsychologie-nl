// Object
export const clone = (original) => Object.assign({}, original)
export const cloneDeep = (original) => JSON.parse(JSON.stringify(original))

/**
 * Use for date-ranges and time-ranges
 */
export function enforceEnDash(text: string): string {
  return text.replace(/[-\u2010\u2011\u2012\u2013\u2014\u2015]/g, '–')
}

/**
 * Removes path from an object recursively.
 * A full path to the key is not required.
 * The original object is not modified.
 *
 * Example:
 *   const original = { a: { b: { c: 'value' } }, c: 'value'  }
 *
 *   omitPathRecursively(original, 'a') // outputs: { c: 'value' }
 *   omitPathRecursively(original, 'c') // outputs: { a: { b: {} } }
 *   omitPathRecursively(original, 'b.c') // { a: { b: {} }, c: 'value' }
 */
export const omitPathRecursively = (original: object, path: string, depth: number = 1) => {
  const segments = path.split('.')
  const final = depth === segments.length

  return JSON.parse(
    JSON.stringify(original, (key, value) => {
      const match = key === segments[depth - 1]

      if (!match) return value
      if (!final) return omitPathRecursively(value, path, depth + 1)
      return undefined
    }),
  )
}

/**
 * Replaces value at path inside an object recursively.
 * A full path to the key is not required.
 * The original object is not modified.
 *
 * Example:
 *   const original = { a: { b: 'foo' } }
 *   const replacer = (value) => value + 'bar'
 *
 *   replacePathsRecursively(original, 'b', replacer)
 *   // output: { a: { b: 'foobar' } }
 */
export const replacePathsRecursively = (
  original: object,
  path: string | string[],
  replacer: Function,
) => {
  const paths = Array.isArray(path) ? path : [path]

  let modified = original

  paths.forEach((path) => {
    modified = internal_replacePathRecursively(modified, path, replacer)
  })

  return modified
}

export const internal_replacePathRecursively = (
  original: object,
  path: string,
  replacer: Function = (value, root) => undefined,
  depth: number = 1,
) => {
  const segments = path.split('.')
  const final = depth === segments.length

  return JSON.parse(
    JSON.stringify(original, (key, value) => {
      const match = key === segments[depth - 1]

      if (!match) return value
      if (!final) return internal_replacePathRecursively(value, path, replacer, depth + 1)

      const replacement = replacer(value)
      if (!replacement || typeof replacement !== 'object') return replacement
      return internal_replacePathRecursively(replacement, path, replacer)
    }),
  )
}
