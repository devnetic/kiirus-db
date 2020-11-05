import { CollectionCommand } from './CollectionCommand'

/**
 *
 * @param {string} command
 * @returns {BaseCommand}
 */
export const getCommand = (command, action) => {
  switch (command) {
    case 'collection':
      return new CollectionCommand(action)

    case 'database':
      return new DatabaseCommand(action)

    case 'role':
      return new RoleCommand(action)

    case 'user':
      return new UserCommand(action)

    default:
      throw new Error(getErrorMessage('KDB0005'))
  }
}
