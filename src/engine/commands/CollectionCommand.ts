
import { BaseCommand } from './BaseCommand'
import { Collection, CollectionOptions, Database } from './../entities'
import { getErrorMessage } from './../../support'

export class CollectionCommand extends BaseCommand {
  async run (database: Database, options: CollectionOptions): Promise<any> {
    if (!options.database) {
      throw new Error('No database selected')
    }

    database.use(options.database)

    const collection: Collection = database.getCollection(options.collection)

    if (!Reflect.has(collection, this.action)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    // const result = await Reflect.get(collection, this.action, collection)(options)
    const result = await (collection as any)[this.action](options)

    return result
  }
}
