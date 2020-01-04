const CollectionCommand = require('./CollectionCommand')
const DatabaseCommand = require('./DatabaseCommand')

const { createError, utils } = require('./../../support')

/**
 *
 * @param {string} command
 * @returns {object}
 */
const getCommand = (command) => {
  const { type, method } = parseCommand(command)

  try {
    switch (type) {
      case 'collection':
        return new CollectionCommand(method)

      case 'database':
        return new DatabaseCommand(method)

      default:
        return { error: `${type}: command not implemented` }
    }
  } catch (e) {
    // TODO: return a proper message for more error types
    return createError(e.message || e, command)
  }
}

/**
 *
 * @param {string} command
 * @returns {object}
 */
const parseCommand = (command) => {
  const methodMatch = command.split(/(\w+)-(.+)/)

  return {
    type: methodMatch[1],
    method: utils.camelCase(methodMatch[2])
  }
}

module.exports = {
  getCommand
}
