const Database = require('./../Database')
const { createError, utils } = require('./../../support')

const databaseCommand = require('./database')
const collectionCommand = require('./collection')

/**
 *
 * @param {IncomingMessage} request
 */
const run = async (request) => {
  const { command, options } = request.body
  const [type, operation] = getTypeOperation(command)
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

    default:
      return { error: `${operation}: command not implemented` }
  }
}

const getTypeOperation = (command) => {
  const operationMatch = command.split(/(\w+)-(.+)/)

  return [operationMatch[1], utils.camelCase(operationMatch[2])]
}

module.exports = run
