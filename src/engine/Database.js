const Collection = require('./Collection')
const { getErrorMessage, storage } = require('./../support')

class Database {
  constructor (name = '') {
    // this.config = Config.getInstance().values
    this.name = name
  }

  /**
  * Creates a new role on the database where you run the command. The
  * createRole command returns a duplicate user error if the user exists.
  *
  * @param {Object<{body: Object, database: string}} options
  */
  async createRole ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const role = await this.getCollection('roles').find({
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    })

    if (role.length > 0) {
      throw new Error(getErrorMessage('KDB0006'))
    }

    body.database = database

    // select the `roles` collection inside the `system` database
    return this.getCollection('roles').insert([body])
  }

  /**
   * Creates a new user on the database where you run the command. The
   * createUser command returns a duplicate user error if the user exists.
   *
   * @param {*} options
   */
  async createUser ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const user = await this.getCollection('users').find({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })

    if (user.length > 0) {
      throw new Error(getErrorMessage('KDB0003'))
    }

    body.database = database

    // select the `users` collection inside the `system` database
    return this.getCollection('users').insert([body])
  }

  drop (options) {
    console.log(options)
  }

  async dropRole ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const query = {
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    }

    const role = await this.getCollection('roles').find(query)

    if (role.length === 0) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    body.database = database

    return this.getCollection('roles').delete(query)
  }

  /**
   * Removes the user from the database on which you run the command.
   *
   * @param {*} options
   */
  dropUser (options) {
    // Select the `system` database
    this.use('system')

    // select the `users` collection inside the `system` database
    return this.getCollection('users').delete(options)
  }

  /**
   *
   * @param {string} collection
   * @returns Collection
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

  async getRole ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const query = {
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    }

    const role = await this.getCollection('roles').find(query)

    if (role.length === 0) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    return this.getCollection('roles').findOne(query)
  }

  async getRoles ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const query = {
      database: { $eq: database }
    }

    const roles = await this.getCollection('roles').find(query)

    return roles.map(role => {
      const { _id, ...rest } = role

      return rest
    })
  }

  /**
   * Get
   * @param {Object} options
   */
  list (options) {
    const pathname = this.getPath()

    return storage.readDir(pathname)
  }

  revokeRolesFromUser ({ body, database }) {
    // Select the `system` database
    this.use('system')

    return this.getCollection('users').update([{
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    }, {
      roles: { $filter: body.roles }
    }])
  }

  /**
   * Updates a user-defined role. The updateRole command must run on the role’s
   * database.
   *
   * @param {*} options
   */
  async updateRole ({ body, database }) {
    this.use('system')

    const role = await this.getCollection('roles').find({
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    })

    if (role.length === 0) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    body.database = database

    // select the `roles` collection inside the `system` database
    return this.getCollection('roles').update([
      {
        $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
      },
      body
    ])
  }

  /**
   * Updates the user’s profile on the database on which you run the command. An
   * update to a field completely replaces the previous field’s values,
   * including updates to the user’s roles.
   *
   * @param {*} options
   */
  async updateUser ({ body, database }) {
    this.use('system')

    const user = await this.getCollection('users').find({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })

    if (user.length === 0) {
      throw new Error(getErrorMessage('KDB0004'))
    }

    body.database = database

    // select the `users` collection inside the `system` database
    return this.getCollection('users').update([
      {
        $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
      },
      body
    ])
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
