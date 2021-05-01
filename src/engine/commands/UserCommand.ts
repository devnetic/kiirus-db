import { BaseCommand } from './BaseCommand';
import { Database, Query, User } from './../entities';
import { getErrorMessage } from './../../support';

export interface UserOptions {
  database: string;
  query?: Query;
  user?: unknown;
}

export class UserCommand extends BaseCommand {
  async run(database: Database, options: UserOptions): Promise<unknown> {
    const user = new User();

    if (!Reflect.has(user, this.action)) {
      throw new Error(getErrorMessage('KDB0002'));
    }

    const result = await (user as any)[this.action](options); // eslint-disable-line

    return result;
  }
}
