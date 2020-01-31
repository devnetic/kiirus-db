const CollectionCommand = require('./CollectionCommand')
const DatabaseCommand = require('./DatabaseCommand')

const { getErrorMessage, utils } = require('./../../support')

/**
 *
 * @param {string} command
 * @returns {object}
 */
const getCommand = (command) => {
  const { type, method } = parseCommand(command)

  switch (type) {
    case 'collection':
      return new CollectionCommand(method)

    case 'database':
      return new DatabaseCommand(method)

    default:
      throw new Error(getErrorMessage('KDB0005'))
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
