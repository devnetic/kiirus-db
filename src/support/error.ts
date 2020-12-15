import * as utils from '@devnetic/utils'

/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @param {string} message
 * @returns {string}
 */
export const getErrorMessage = (code: string, message: string = ''): string => {
  return `${code}: ${process.env[code]?.replace('{{}}', message ? ` [${message}]` : '')} - ${utils.dateFormat(new Date(), 'YYYY-MM-dd HH:mm:ss')}`
}

/**
 *
 * @param {string} error
 * @param {string} command
 * @returns {Object}
 */
export const unexpectedError = (error: string, command: string): Object => {
  if (error.includes('is not a function')) {
    return getErrorMessage('KDB0002')
  }

  return { error }
}
