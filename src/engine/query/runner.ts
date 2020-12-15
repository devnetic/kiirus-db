import { build } from './builder'
import { compile } from './compiler'
import { parse } from './parser'

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
export const runner = (
  query: ArrayLike<any>,
  type: string = 'query',
  join: string = ' && '
): Function => {
  return build(compile(parse(query), type, join), type)
}
