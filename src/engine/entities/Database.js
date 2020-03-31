import BaseEntity from './BaseEntity'
import { storage } from './../../support'

export default class Database extends BaseEntity {
  constructor (name = '') {
    super()

    this.name = name
  }

  drop (options) {
    console.log(options)
  }

  /**
   * Return the collection path
   *
   * @returns {string}
   * @memberof Collection
   */
  getPath () {
    return process.env.DB_PATH
  }

  /**
   * Get
   * @param {Object} options
   */
  list (options) {
    const pathname = this.getPath()

    return storage.readDir(pathname)
  }

  /**
   * Returns information about one or more users.
   *
   * @param {*} options
   */
  usersInfo (options) {
    // {
    //   username: '<user>',
    //   showPrivileges: true
    // }

    // {
    //   usersInfo: [{ user: '<user>', db: "home" }, { user: '<user>', db: "myApp" }],
    //   showPrivileges: true
    // }
  }
}
