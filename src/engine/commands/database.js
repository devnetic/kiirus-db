const database = async (instance, operation, options = {}) => {
  instance.use(options.database)

  const result = await instance[operation](options.data)

  return result
}

module.exports = database
