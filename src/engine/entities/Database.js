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

  /**
   * Get
   * @param {Object} options
   */
  list (options) {
    return storage.readDir(process.env.DB_PATH)
  }
}
