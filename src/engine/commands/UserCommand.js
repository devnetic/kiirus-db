import BaseCommand from './BaseCommand'
import { getErrorMessage } from './../../support'
import { User } from '../entities'

export default class UserCommand extends BaseCommand {
  async run (database, options = {}) {
    const user = new User()

    if (!Reflect.has(user, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await user[this.method](options)
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
