import path from 'path'

import * as utils from '@devnetic/utils'

import * as storage from './../storage'
import { ObjectId } from '../ObjectId'
import { runner } from './../query'

export class Collection {
  /**
   *
   * @param {string} database
   * @param {string} name
   */
  constructor (database, name = '') {
    this.database = database
    this.extension = '.json'
    this.name = name
    this.query = { run: runner }
    this.records = []
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
    const pathname = this.getPath()

    await this.init(pathname)

    return this.write(pathname, data)
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
