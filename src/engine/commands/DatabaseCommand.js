const BaseCommand = require('./BaseCommand')
const { getErrorMessage } = require('./../../support')

class DatabaseCommand extends BaseCommand {
  async run (database, options = {}) {
    database.use(options.database)

    if (!Reflect.has(database, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await database[this.method](options)

    return result
  }
}

module.exports = DatabaseCommand
