const errorTypes = [
  'ENOENT'
]

/**
 *
 * @param {string} error
 * @param {IncomingMessage} request
 * @returns {Object}
 */
const createError = (error, request) => {
  if (error.includes('is not a function')) {
    return { error: `${request.body.command}: command not implemented` }
  }

  return { error }
}

module.exports = {
  createError
}
