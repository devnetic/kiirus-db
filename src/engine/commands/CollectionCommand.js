import { BaseCommand } from './BaseCommand'
import { getErrorMessage } from './../../support'

export class CollectionCommand extends BaseCommand {
  async run (database, options) {
    if (!options.database) {
      throw new Error('No database selected')
    }

    database.use(options.database)

    const collection = database.getCollection(options.collection)

    if (!Reflect.has(collection, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await collection[this.action](options.body)

    return result
  }
}
