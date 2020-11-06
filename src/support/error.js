import * as utils from '@devnetic/utils'

/**
 *
 * @param {string} error
 * @param {string} command
 * @returns {Object}
 */
export const unexpectedError = (error, command) => {
  if (error.includes('is not a function')) {
    return getErrorMessage('KDB0002')
  }

  return { error }
}

/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @returns {string}
 */
export const getErrorMessage = (code, message) => {
  return `${code}: ${process.env[code].replace('{{}}', message ? ` [${message}]` : '')} - ${utils.dateFormat(new Date(), 'YYYY-MM-dd HH:mm:ss')}`
}
