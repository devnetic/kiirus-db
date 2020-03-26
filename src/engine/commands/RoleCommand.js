import BaseCommand from './BaseCommand'
import { getErrorMessage } from './../../support'
import { Role } from '../entities'

export default class RoleCommand extends BaseCommand {
  async run (database, options = {}) {
    const role = new Role()

    if (!Reflect.has(role, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await role[this.method](options)
      .catch(error => {
        const message = error.message || error

        // If the error message is a engine error, just throw it
        if (message.indexOf('KDB') !== -1) {
          throw new Error(error)
        }

        throw new Error(getErrorMessage('KDB0007', error))
      })

    return result
  }
}
