// import CollectionCommand from './CollectionCommand'
// import DatabaseCommand from './DatabaseCommand'
// import RoleCommand from './RoleCommand'
import {
  CollectionCommand,
  DatabaseCommand,
  RoleCommand,
  UserCommand
} from './'
import { getErrorMessage, utils } from './../../support'

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

    case 'role':
      return new RoleCommand(method)

    case 'user':
      return new UserCommand(method)

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

export default getCommand
