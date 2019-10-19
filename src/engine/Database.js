const path = require('path')

const Collection = require('./Collection')
const { storage } = require('./../support')

class Database {
  constructor (name = '') {
    // this.config = Config.getInstance().values
    this.name = name
  }

  /**
   *
   *
   * @param {*} collection
   * @returns
   */
  getCollection (collection) {
    return new Collection(this.name, collection)
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
      this.database
    )
  }

  list (options) {
    const pathname = this.getPath()

    return storage.readDir(pathname)
  }

  /**
   * Select the given database
   *
   * @param {string} name
   */
  use (name) {
    this.name = name
  }
}

module.exports = Database
