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

module.exports = {
  createError
}
