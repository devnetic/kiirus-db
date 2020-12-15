import path from 'path'

import * as utils from '@devnetic/utils'

import { BaseCommonEntity } from './BaseCommonEntity'

import { runner } from './../query'
import { ObjectId } from './../ObjectId'
import * as storage from './../storage'

interface WriteError {
  code: number
  message: string
}

interface WriteResponse {
  nInserted: number
  writeError?: WriteError
}

// export interface CollectionOptions {
//   database: string
//   collection: string
//   data?: Array<any>
// }

interface Query {
  run: Function
}

export interface CollectionOptions {
  database: string
  collection: string
}

interface CollectionDeleteOptions extends CollectionOptions {
  query: object
}

interface CollectionInsertOptions extends CollectionOptions {
  documents: Array<any>
}

export class Collection extends BaseCommonEntity {
  private extension: string
  private query: Query
  private records: Array<any> = []

  /**
   *
   * @param {string} database
   * @param {string} name
   */
  constructor(protected database: string, name: string = '') {
    super()

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
  cipher (data: any): string {
    return data
  }

  /**
   * Delete one or many records from the collection using a query
   *
   * @param {Function|Object} query
   *
   * @return Promise<Object>
   */
  async delete ({ query }: CollectionDeleteOptions) {
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

  /**
   * Return the collection path
   *
   * @returns {string}
   * @memberof Collection
   */
  getPath (): string {
    return path.join(
      process.env.DB_PATH ?? '',
      this.database,
      this.name
    )
  }

  /**
   * Read a set of files from the collection path
   *
   * @param {Function} query
   * @returns {Promise<array>}
   */
  async getRecords (query: Function): Promise<Array<any>> {
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
   * Insert a data set into the collection
   *
   * @param {Array<Object>} data
   * @return {Promise<boolean>}
   */
  async insert({ documents }: CollectionInsertOptions): Promise<WriteResponse> {
    try {
      const pathname = this.getPath()

      await this.init(pathname)

      return this.write(pathname, documents)
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
  async write (collection: string, data: Array<any>): Promise<WriteResponse> {
    const response: WriteResponse = {
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
          message: error.message
        }
      }
    }

    return response
  }
}
