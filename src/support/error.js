const createError = (error, request) => {
  console.log(error)

  if (error.message.includes('is not a function')) {
    return { error: `${request.body.command}: command not implemented` }
  }

  if (error.code) {
    switch (error.code) {
      case 'ENOENT':
        return new Error(`'${this.name}' collection doesn't exist`)
    }
  }

  return { error: error.message }
}

module.exports = {
  createError
}
