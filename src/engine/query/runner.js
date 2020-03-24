const { build } = require('./builder')
const { compile } = require('./compiler')
const { parse } = require('./parser')

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const run = (query, type = 'query', join = ' && ') => {
  return build(compile(parse(query), type, join), type)
}

module.exports = {
  run
}
