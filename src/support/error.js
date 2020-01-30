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

const getErrorMessage = (code) => {
  const formatedDate = new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())

  return `${code}: ${process.env[code]} - ${formatedDate}`
}

module.exports = {
  createError,
  getErrorMessage
}
