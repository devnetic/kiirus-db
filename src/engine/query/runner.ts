import { Query } from '../entities'
import { build } from './builder'
import { compile } from './compiler'
import { parse } from './parser'

/**
 *
 * @param {Query} query
 * @param {string} type
 * @param {string} join
 * @returns {Function}
 */
export const runner = (query: Query, type = 'query', join = ' && '): Function => {  // eslint-disable-line
  return build(compile(parse(query), type, join), type)
}
