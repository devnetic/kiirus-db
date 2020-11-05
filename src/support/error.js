import * as utils from '@devnetic/utils'

/**
 *
 * @param {string} error
 * @param {string} command
 * @returns {Object}
 */
const createError = (error, command) => {
  if (error.includes('is not a function')) {
    return { error: `${command}: command not implemented` }
  }

  return { error }
}

/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @returns {string}
 */
const getErrorMessage = (code, message) => {
  return `${code}: ${process.env[code].replace('{{}}', message ? ` [${message}]` : '')} - ${utils.dateFormat(new Date(), 'YYYY-MM-dd HH:mm:ss')}`
}

export {
  createError,
  getErrorMessage
}
