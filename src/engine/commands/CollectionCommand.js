const BaseCommand = require('./BaseCommand')

class CollectionCommand extends BaseCommand {
  async run (database, options) {
    if (!options.database) {
      throw new Error('No database selected')
    }

    database.use(options.database)

    const collection = database.getCollection(options.collection)

    const result = await collection[this.method](options.body)

    return result
  }
}

module.exports = CollectionCommand
