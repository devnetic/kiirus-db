const { RECORD_NAME } = require('./common')

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const build = (compiled, type = 'query') => {
  const functionBody = type === 'query' ? `return ${compiled || true}` : `${compiled}; return ${RECORD_NAME};`

  console.log('compiled: %o', `'use strict'; ${functionBody}`)

  return new Function(RECORD_NAME, 'isEqual', 'getType', `'use strict'; ${functionBody}`) // eslint-disable-line
}

module.exports = {
  build
}
