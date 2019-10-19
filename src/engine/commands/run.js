const Database = require('../Database')

const databaseCommand = require('./database')
const collectionCommand = require('./collection')

// const database = new Database()

/* const collectionCommand = async (database, operation, options) => {
  // console.log(database, options)

  // try {
    database.use(options.database)

    const collection = database.getCollection(options.collection)

    const result = await collection[operation](options.data)

    return result
  // } catch (error) {
  //   console.log(error)

  //   return {}
  // }
} */

// const databaseCommand = () => {

// }

const run = async (request) => {
  const { command, options } = request.body
  const [type, operation] = command.split('-')
  let result

  // console.log('command: %o', request.body)
  // console.log('type: %s, operation: %s', type, operation)

  switch (type) {
    case 'collection':
      try {
        result = await collectionCommand(new Database(), operation, options)

        return result
      } catch (e) {
        return { error: e.message }
      }

    case 'database':
      result = await databaseCommand(new Database(), operation, options)

      return result
  }
}

module.exports = run
