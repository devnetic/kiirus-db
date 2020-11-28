import path from 'path'

import * as utils from '@devnetic/utils'

import * as storage from './../storage'
import { ObjectId } from '../ObjectId'
import { runner } from './../query'
import { CommonEntity } from './CommonEntity'

export class Collection extends CommonEntity {
  /**
   *
   * @param {string} database
   * @param {string} name
   */
  constructor (database, name = '') {
    super()

    this.database = database
    this.extension = '.json'
    this.name = name
    this.query = { run: runner }
    this.records = []
  }

  /**
   * Returns the count of documents that would match a find() query for the
   * collection
   *
   * @param {object} query
   * @returns {number}
   */
  async count (query) {
    try {
      const result = await this.find(query)

      return result.length
    } catch (error) {
      throw new Error(this.getError(error))
    }
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
   * @param {Function|Object} query
   *
   * @return Promise<Object>
   */
  async delete (query) {
    try {
      const records = await this.getRecords(this.query.run(query))

      const response = {
        deletedCount: 0
      }

      for (const record of records) {
        const result = await storage.deleteFile(record.file)

        if (result === undefined) {
          response.deletedCount += 1
        }
      }

      return response
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  async drop () {
    try {
      await storage.deleteDir(this.getPath())

      return true
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  /**
   * Select a record set using a query expression
   *
   * @param {Function|Object} [query = {}]
   * @returns {Promise<Array>}
   */
  async find (query = {}) {
    try {
      const result = await this.getRecords(this.query.run(query))

      return result.map(record => {
        this.records.push(record.file)

        return record.data
      })
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  /**
   * Select a record using a query expression
   *
   * @param {Function|Object} query
   * @returns {Promise<Array>}
   */
  async findOne (query = {}) {
    try {
      const result = await this.find(query)

      if (result.length > 0) {
        return result[0]
      }

      return undefined
    } catch (error) {
      throw new Error(this.getError(error))
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
    } catch (error) {
      throw new Error(this.getError(error))
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
    try {
      return await storage.createDir(pathname, true, 0o766)
    } catch (error) {
      if ((error.message || error).indexOf('EEXIST') === -1) {
        return new Error(error)
      }

      return true
    }
  }

  /**
   * Insert a data set into the collection
   *
   * @param {Array<Object>} data
   * @return {Promise<boolean>}
   */
  async insert (data) {
    try {
      const pathname = this.getPath()

      await this.init(pathname)

      return this.write(pathname, data)
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  /**
 * Rename a file or directory
 *
 * @param {string} newName
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 * @memberof Collection
 */
  async rename (newName) {
    const newPathname = path.join(
      process.env.DB_PATH,
      this.database,
      newName
    )

    const response = {
      nModified: 0
    }

    try {
      await storage.rename(this.getPath(), newPathname)

      response.nModified = 1

      return response
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  /**
   * Update a collection using a query to select the records to update and a
   * update object, containing the key and values to be updated
   *
   * @param {Array<{query: Object, update: Array}>} query
   * @param {object} update
   *
   * @return {Promise<object>}
   */
  async update ([query, update]) {
    try {
      const records = await this.getRecords(this.query.run(query))

      const response = {
        nModified: 0
      }

      for (const record of records) {
        record.data = this.query.run(update, 'aggregation', ';')(record.data, utils.isEqual, utils.getType)

        const result = await storage.writeJson(record.file, record.data)

        if (result === undefined) {
          response.nModified += 1
        }
      }

      return response
    } catch (error) {
      throw new Error(this.getError(error))
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
          path.join(collection, utils.uuid() + this.extension),
          this.cipher(JSON.stringify(record))
        )

        response.nInserted += 1
      } catch (error) {
        response.writeError = {
          code: error.name,
          errmsg: error.message
        }
      }
    }

    return response
  }
}
