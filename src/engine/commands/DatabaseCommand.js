import BaseCommand from './BaseCommand'
import { getErrorMessage } from './../../support'

export default class DatabaseCommand extends BaseCommand {
  async run (database, options = {}) {
    database.use(options.database)

    if (!Reflect.has(database, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await database[this.method](options)
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
