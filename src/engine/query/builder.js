import { RECORD_NAME } from './common'

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
export const build = (compiled, type = 'query') => {
  const functionBody = type === 'query' ? `return ${compiled || true}` : `${compiled}; return ${RECORD_NAME};`

  if (process.env.LOG_QUERIES === 'true') {
    console.log('query: %o', functionBody)
  }

  return new Function(RECORD_NAME, 'isEqual', 'getType', `'use strict'; ${functionBody}`) // eslint-disable-line
}
