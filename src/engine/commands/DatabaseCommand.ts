import { BaseCommand } from './BaseCommand'
import { Database } from './../entities'
import { getErrorMessage } from './../../support'

interface DatabaseOptions {
  database?: string
  name?: string
}

export class DatabaseCommand extends BaseCommand {
  /**
   *
   * @param {Database} database
   * @param {Options} options
   */
  async run (database: Database, options: DatabaseOptions = {}) {
    if (options.database) {
      database.use(options.database)
    }

    if (!Reflect.has(database, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await Reflect.get(database, this.action)(options)

    return result
  }
}
