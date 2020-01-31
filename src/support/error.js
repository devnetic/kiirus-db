const utils = require('./../support/utils')

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
const getErrorMessage = (code) => {
  return `${code}: ${process.env[code]} - ${utils.dateFormat(new Date(), 'yyyy-mm-dd HH:nn:ss')}`
}

module.exports = {
  createError,
  getErrorMessage
}
