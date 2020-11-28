import { BaseCommand } from './BaseCommand'
import { getErrorMessage } from './../../support'
import { Role } from './../entities'

export class RoleCommand extends BaseCommand {
  async run (database, options = {}) {
    const role = new Role()

    if (!Reflect.has(role, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await role[this.action](options.body)

    return result
  }
}
