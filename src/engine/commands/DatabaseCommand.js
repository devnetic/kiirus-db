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

    const result = await database[this.action](options.body)

    return result
  }
}
