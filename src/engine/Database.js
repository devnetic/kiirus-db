const Collection = require('./Collection')
const { storage } = require('./../support')

class Database {
  constructor (name = '') {
    // this.config = Config.getInstance().values
    this.name = name
  }

  /**
   * Creates a new user on the database where you run the command. The
   * createUser command returns a duplicate user error if the user exists.
   *
   * @param {*} options
   */
  createUser (options) {
    // Select the `system` database
    this.use('system')

    // select the `users` collection inside the `system` database
    return this.getCollection('users').insert(options)
  }

  drop (options) {
    console.log(options)
  }

  /**
   * Removes the user from the database on which you run the command.
   *
   * @param {*} options
   */
  dropUser (options) {
    // {
    //   username: "<user>",
    // }
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
   * Updates the user’s profile on the database on which you run the command. An
   * update to a field completely replaces the previous field’s values,
   * including updates to the user’s roles.
   *
   * @param {*} options
   */
  updateUser (options) {
    // {
    //   username: "appClient01",
    //   password: '<password>',
    //   data : { employeeId: "0x3039" },
    //   roles: [{ role: "read", db: "assets" }]
    // }
  }

  /**
   * Select the given database
   *
   * @param {string} name
   */
  use (name) {
    this.name = name
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

module.exports = Database
