import { BaseCommand } from './BaseCommand';
import { Database } from './../entities';
import { getErrorMessage } from './../../support';

interface DatabaseOptions {
  database?: string;
  name?: string;
}

export class DatabaseCommand extends BaseCommand {
  /**
   *
   * @param {Database} database
   * @param {Options} options
   */
  async run(database: Database, options: DatabaseOptions = {}): Promise<unknown> {
    if (options.database !== undefined) {
      database.use(options.database);
    }

    if (!Reflect.has(database, this.action)) {
      throw new Error(getErrorMessage('KDB0013', 'Database'));
    }

    // const result = await Reflect.get(database, this.action)(options)
    const result = await (database as any)[this.action](options); // eslint-disable-line

    return result;
  }
}
