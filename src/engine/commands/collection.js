const collection = async (database, operation, options) => {
  if (!options.database) {
    throw new Error('No database selected')
  }

  database.use(options.database)

  const collection = database.getCollection(options.collection)

  const result = await collection[operation](options.data)

  return result
}

module.exports = collection
