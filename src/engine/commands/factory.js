import * as utils from '@devnetic/utils'

import {
  CollectionCommand,
  DatabaseCommand
} from '.'

/**
 *
 * @param {string} command
 * @returns {BaseCommand}
 */
export const getCommand = (command, action) => {
  switch (command) {
    case 'collection':
      return new CollectionCommand(getAction(action))

    case 'database':
      return new DatabaseCommand(getAction(action))

    case 'role':
      return new RoleCommand(getAction(action))

    case 'user':
      return new UserCommand(getAction(action))

    default:
      throw new Error(getErrorMessage('KDB0005'))
  }
}

/**
 *
 * @param {string} command
 * @returns {string}
 */
const getAction = (action) => {
  return utils.camelCase(action)
}
