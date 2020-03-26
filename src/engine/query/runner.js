import build from './builder'
import compile from './compiler'
import parse from './parser'

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const runner = (query, type = 'query', join = ' && ') => {
  return build(compile(parse(query), type, join), type)
}

export default runner
