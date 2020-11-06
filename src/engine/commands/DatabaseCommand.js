import { BaseCommand } from './BaseCommand'
import { getErrorMessage } from './../../support'

/**
 * The complete Triforce, or one or more components of the Triforce.
 *
 * @typedef {Object} Options
 * @property {string} database - The database name
 */

export class DatabaseCommand extends BaseCommand {
  /**
   *
   * @param {Database} database
   * @param {Options} options
   */
  async run (database, options = {}) {
    database.use(options.database)

    if (!Reflect.has(database, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await database[this.action](options)

    return result

    // const result = await database[this.action](options)
    //   .catch(error => {
    //     const message = error.message || error

    //     // If the error message is a engine error, just throw it
    //     if (message.indexOf('KDB') !== -1) {
    //       throw new Error(error)
    //     }

    //     throw new Error(getErrorMessage('KDB0007', error))
    //   })
  }
}
