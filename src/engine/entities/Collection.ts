import path from 'path'

import * as utils from '@devnetic/utils'

import { BaseCommonEntity } from './BaseCommonEntity'

import { runner } from './../query'
import { ObjectId } from './../ObjectId'
import * as storage from './../storage'
import { getErrorMessage } from './../../support'
import {
  CollectionInsertOptions,
  CollectionOptions,
  DeleteResponse,
  InsertResponse,
  UpdateResponse
} from './types'

interface Query {
  run: typeof runner
}

interface CollectionQueryOptions extends CollectionOptions {
  // query: ArrayLike<any>
  query: any
}

interface CollectionUpdateOptions extends CollectionQueryOptions {
  update: ArrayLike<any>
}

interface CollectionRenameOptions extends CollectionOptions {
  target: string
}

export class Collection extends BaseCommonEntity {
  private extension: string
  private readonly query: Query
  private readonly records: any[] = []

  /**
   *
   * @param {string} database
   * @param {string} name
   */
  constructor (protected database: string, name: string = '') {
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
   * Returns the count of documents that would match a find() query for the
   * collection
   *
   * @param {CollectionQueryOptions} options
   * @returns {number}
   */
  async count (options: CollectionQueryOptions): Promise<number> {
    try {
      const result = await this.find(options)

      return result.length
    } catch (error) {
      const message = getErrorMessage('KDB0006', error.message)

      throw new Error(message)
    }
  }

  /**
   * Delete one or many records from the collection using a query
   *
   * @param {CollectionQueryOptions} options
   *
   * @return Promise<Object>
   */
  async delete ({ query }: Pick<CollectionQueryOptions, 'query'>): Promise<DeleteResponse> {
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
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  async drop (): Promise<boolean> {
    try {
      await storage.deleteDir(this.getPath())

      return true
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  async filter ({ query }: Pick<CollectionQueryOptions, 'query'>): Promise<any[]> {
    try {
      const records = await this.getRecords()

      // return records.map(record => {
      //   this.records.push(record.file)

      //   return record.data
      // })

      return records.filter(item => this.query.run(query)(item.data)).map(record => {
        this.records.push(record.file)

        return record.data
      })
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  /**
   * Select a record set using a query expression
   *
   * @param {Function|Object} [query = {}]
   * @returns {Promise<Array>}
   */
  async find ({ query }: Pick<CollectionQueryOptions, 'query'>): Promise<any[]> {
    try {
      const result = await this.getRecords(this.query.run(query))

      return result.map(record => {
        this.records.push(record.file)

        return record.data
      })
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  /**
   * Select a record using a query expression
   *
   * @param {CollectionQueryOptions} options
   * @returns {Promise<ArrayLike<any>>}
   */
  async findOne (options: CollectionQueryOptions): Promise<any> {
    try {
      const result = await this.find(options)

      if (result.length > 0) {
        return result[0]
      }

      return undefined
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
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
  async getRecords (query?: Function): Promise<any[]> {
    const pathname = this.getPath()

    try {
      const files = await storage.readDir(pathname)

      const records = []

      for (let file of files) {
        file = path.join(pathname, file)

        const data = await storage.readJson(file)

        if (query === undefined || query(data, utils.isEqual) === true) {
          records.push({ file, data })
        }
      }

      return records
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  /**
   * Insert a data set into the collection
   *
   * @param {Array<Object>} data
   * @return {Promise<boolean>}
   */
  async insert ({ document }: Pick<CollectionInsertOptions, 'document'>): Promise<InsertResponse> {
    try {
      const pathname = this.getPath()

      await this.init(pathname)

      return this.write(pathname, document)
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }

  async list (): Promise<string[]> {
    return storage.readDir(this.getPath())
  }

  /**
   * Rename a file or directory
   *
   * @param {string} newName
   * @returns {Promise<boolean|NodeJS.ErrnoException>}
   * @memberof Collection
   */
  async rename ({ target }: CollectionRenameOptions): Promise<UpdateResponse> {
    try {
      const newPathname = path.join(
        process.env.DB_PATH ?? '',
        this.database,
        target
      )

      await storage.rename(this.getPath(), newPathname)

      const response: UpdateResponse = {
        nModified: 1
      }

      return response
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
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
  async update ({ query, update }: CollectionUpdateOptions): Promise<UpdateResponse> {
    try {
      const records = await this.getRecords(this.query.run(query))

      const response: UpdateResponse = {
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
      throw new Error(getErrorMessage('KDB0006', error.message))
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
  async write (collection: string, data: unknown | unknown[]): Promise<InsertResponse> {
    const response: InsertResponse = {
      nInserted: 0
    }

    for (const record of (Array.isArray(data) ? data : [data])) {
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
