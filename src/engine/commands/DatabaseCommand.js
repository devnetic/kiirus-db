const BaseCommand = require('./BaseCommand')

class DatabaseCommand extends BaseCommand {
  async run (database, options = {}) {
    database.use(options.database)

    const result = await database[this.method](options.data)

    return result
  }
}

module.exports = DatabaseCommand
