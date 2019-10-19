const createError = (message, request) => {
  if (message.includes('is not a function')) {
    return { error: `${request.body.command}: command not implemented` }
  }

  return { error: `Unexpected error: ${message}` }
}

module.exports = {
  createError
}
