import path from 'path'

import * as storage from './../storage'

export abstract class BaseCommonEntity {
  protected name: string = ''

  async drop (database: string): Promise<boolean> {
    try {
      await storage.deleteDir(this.getPath(database))

      return true
    } catch (error) {
      // throw new Error(this.getError(error))
      throw new Error(error)
    }
  }

  /**
   * Return the collection path
   *
   * @param {string} [database]
   * @returns {string}
   * @memberof Collection
   */
  getPath(database?: string): string {
    return path.join(
      process.env.DB_PATH ?? '',
      database ?? this.name
    )
  }

  /**
   * Create the collection and the database directories if they don't exist
   *
   * @param {*} pathname
   * @returns Promise<boolean>
   * @memberof Collection
   */
  async init (pathname: string) {
    try {
      return await storage.createDir(pathname, true, 0o766)
    } catch (error) {
      if ((error.message || error).indexOf('EEXIST') === -1) {
        return new Error(error)
      }

      return true
    }
  }

  getError(error: NodeJS.ErrnoException): string {
    if (!error.code) {
      return error.message
    }


    switch (error.code) {
      case 'ENOENT':
        return `'${this.name}' ${this.constructor.name.toLowerCase()} doesn't exist`
      default:
        return error.message
    }
  }
}
