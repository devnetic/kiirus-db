const Database = require('./../Database')
const { createError } = require('./../../support')

const databaseCommand = require('./database')
const collectionCommand = require('./collection')

/**
 *
 * @param {IncomingMessage} request
 */
const run = async (request) => {
  const { command, options } = request.body
  const [type, operation] = command.split('-')
  let result

  switch (type) {
    case 'collection':
      try {
        result = await collectionCommand(new Database(), operation, options)

        return result
      } catch (e) {
        // TODO: return a proper message for more error types
        return createError(e.message || e, request)
      }

    case 'database':
      result = await databaseCommand(new Database(), operation, options)

      return result
  }
}

module.exports = run
