import { isNil } from '@devnetic/utils'

import { logger } from './../../support'
import { RECORD_NAME } from './common'

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
export const build = (compiled: string, type = 'query'): Function => { // eslint-disable-line
  const functionBody = type === 'query' ? `return ${!isNil(compiled) ? compiled : 'true'}` : `${compiled}; return ${RECORD_NAME};`

  if (process.env.LOG_QUERIES === 'true') {
    logger(`Query: [ ${functionBody} ]`, 'debug')
  }

  return new Function(RECORD_NAME, 'isEqual', 'getType', `'use strict'; ${functionBody}`) // eslint-disable-line
}
