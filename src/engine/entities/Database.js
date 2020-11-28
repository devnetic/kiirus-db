import path from 'path'

import * as storage from './../storage'
import { BaseEntity } from './BaseEntity'

export class Database extends BaseEntity {
  constructor (name = '') {
    super()

    this.name = name
  }

  /**
   * Return the collection path
   *
   * @returns {string}
   * @memberof Collection
   */
  getPath () {
    // return process.env.DB_PATH
    return path.join(
      process.env.DB_PATH,
      this.name
    )
  }

  list () {
    return storage.readDir(process.env.DB_PATH)
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
}
