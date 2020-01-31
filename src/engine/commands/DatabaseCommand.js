const BaseCommand = require('./BaseCommand')
const { getErrorMessage } = require('./../../support')

class DatabaseCommand extends BaseCommand {
  async run(database, options = {}) {
    database.use(options.database)

    if (!Reflect.has(database, this.method)) {
      throw new Error(getErrorMessage('KDB0002'))
    }

    const result = await database[this.method](options)
      .catch(error => {
        throw new Error(getErrorMessage('KDB0007', error))
      })

    return result
  }
}

module.exports = DatabaseCommand
