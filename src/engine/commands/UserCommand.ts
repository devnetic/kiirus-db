
import { BaseCommand } from './BaseCommand'
import { Database, User } from './../entities'
import { getErrorMessage } from './../../support'

export interface UserOptions {
  database: string
  query?: any
  user?: any
}

export class UserCommand extends BaseCommand {
  async run (database: Database, options: UserOptions): Promise<any> {
    const user = new User()

    if (!Reflect.has(user, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await (user as any)[this.action](options)

    return result
  }
}
