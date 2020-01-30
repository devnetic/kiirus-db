const BaseCommand = require('./BaseCommand')
const { getErrorMessage } = require('./../../support')

class CollectionCommand extends BaseCommand {
  async run (database, options) {
    if (!options.database) {
      throw new Error('No database selected')
    }

    database.use(options.database)

    const collection = database.getCollection(options.collection)

    if (!Reflect.has(collection, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await collection[this.method](options.body)

    return result
  }
}

module.exports = CollectionCommand
