const path = require('path')

const ObjectId = require('./ObjectId')
const queryParser = require('./query/parser')
const { storage, utils } = require('./../support')

class Collection {
  /**
   *
   * @param {string} database
   * @param {string} name
   */
  constructor (database, name) {
    this.database = database
    this.extension = '.json'
    this.name = name
    this.queryParser = queryParser
  }

  /**
   * Perform a cipher over the data
   *
   * @param {*} data
   * @returns {string}
   * @memberof Collection
   */
  cipher (data) {
    return data
  }

  /**
   * Returns the count of documents that would match a find() query for the
   * collection
   *
   * @param {object} query
   * @returns {number}
   */
  async count (query) {
    const result = await this.find(query)

    return result.length
  }

  /**
   * Perform a decipher over the data
   *
   * @param {string} data
   * @returns {string}
   * @memberof Collection
   */
  decipher (data) {
    return data
  }

  /**
   * Delete one or many records from the collection using a query
   *
   * @param {function|string} query
   *
   * @return Promise<Object>|Object
   */
  async delete (query) {
    try {
      const records = await this.find(query)

      const response = {
        deletedCount: 0
      }

      for (const record of records) {
        const result = await storage.deleteFile(record.file)

        if (result) {
          response.deletedCount += 1
        }
      }

      return response
    } catch (e) {
      return Promise.reject(this.getError(e))
    }
  }

  async drop (pathname) {
    try {
      await storage.deleteDir(this.getPath())

      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Select a fields set using a query expression
   *
   * @param {function|object} query
   * @return {Promise<array>}
   */
  async find (query) {
    try {
      return await this.getRecords(this.queryParser.build(query))
    } catch (e) {
      return Promise.reject(this.getError(e))
    }
  }

  getError (error) {
    if (!error.code) {
      return error
    }

    switch (error.code) {
      case 'ENOENT':
        return `'${this.name}' collection doesn't exist`
    }
  }

  /**
 * Return the collection path
 *
 * @returns {string}
 * @memberof Collection
 */
  getPath () {
    return path.join(
      process.env.DB_PATH,
      this.database,
      this.name
    )
  }

  /**
   * Read a set of files from the collection path
   *
   * @param {object} query
   * @returns {Promise<array>}
   */
  async getRecords (query) {
    const pathname = this.getPath()

    try {
      const files = await storage.readDir(pathname)

      const records = []

      for (let file of files) {
        file = path.join(pathname, file)

        const data = await storage.readJson(file)

        if (query(data) === true) {
          records.push({ file, data })
        }
      }

      return records
    } catch (e) {
      return Promise.reject(this.getError(e))
    }
  }

  /**
   * Create the collection and the database directories if they don't exist
   *
   * @param {*} pathname
   * @returns Promise<boolean>
   * @memberof Collection
   */
  async init (pathname) {
    return storage.createDir(pathname)
  }

  /**
   * Insert a data set into the collection
   *
   * @param {array} data
   * @return {Promise<boolean>}
   */
  async insert (data) {
    const pathname = this.getPath()

    await this.init(pathname)

    return this.write(pathname, data)
  }

  /**
   * Rename a file or directory
   *
   * @param {string} newName
   * @returns {Promise<boolean|NodeJS.ErrnoException>}
   * @memberof Collection
   */
  rename (newName) {
    const newPathname = path.join(
      process.env.DB_PATH,
      this.database,
      newName
    )

    return storage.rename(this.getPath(), newPathname)
  }

  /**
   * Update a collection using a query to select the records to update and a
   * update object, containing the key and values to be updated
   *
   * @param {function|object} query
   * @param {object} update
   *
   * @return {Promise<Object>}
   */
  async update ([query, update]) {
    try {
      const records = await this.find(query)

      const response = {
        nModified: 0
      }

      for (const record of records) {
        for (const [key, value] of Object.entries(update)) {
          utils.setValue(record.data, key, value)
        }

        // const pathname = path.join(
        //   this.getPath(),
        //   record.file + this.extension
        // )

        const result = await storage.writeJson(record.file, record.data, true)

        if (result) {
          response.nModified += 1
        }
      }

      return response
    } catch (e) {
      return Promise.reject(this.getError(e))
    }
  }

  /**
   * Write a ate set to a given collection and return the records ids
   *
   * @param {string} collection
   * @param {array} data
   *
   * @return {Promise<array>}
   */
  async write (collection, data) {
    const response = {
      nInserted: 0
    }

    for (const record of data) {
      // a 4 - byte value representing the seconds since the Unix epoch,
      // a 5 - byte random value, and
      // a 3 - byte counter, starting with a random value.
      if (record._id === undefined) {
        record._id = new ObjectId().toString()
      }

      try {
        await storage.writeFile(
          // path.join(collection, record._id + '.json'),
          path.join(collection, utils.uuid() + this.extension),
          this.cipher(JSON.stringify(record))
        )

        // response.push(record._id)
        response.nInserted += 1
      } catch (e) {
        response.writeError = {
          code: e.name,
          errmsg: e.message
        }
      }
    }

    return response
  }
}

module.exports = Collection
