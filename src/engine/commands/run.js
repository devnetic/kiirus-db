const Database = require('./../Database')
const { createError } = require('./../../support')

const databaseCommand = require('./database')
const collectionCommand = require('./collection')

const run = async (request) => {
  const { command, options } = request.body
  const [type, operation] = command.split('-')
  let result

  switch (type) {
    case 'collection':
      try {
        result = await collectionCommand(new Database(), operation, options)

        return result
      } catch (e) {
        return createError(e)
      }

    case 'database':
      result = await databaseCommand(new Database(), operation, options)

      return result
  }
}

module.exports = run
