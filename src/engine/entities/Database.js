import BaseEntity from './BaseEntity'
import { getErrorMessage, storage } from './../../support'

export default class Database extends BaseEntity {
  constructor (name = '') {
    super()

    this.name = name
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
   * Return the collection path
   *
   * @returns {string}
   * @memberof Collection
   */
  getPath () {
    return process.env.DB_PATH
  }

  async getUser ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const query = {
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    }

    const user = await this.getCollection('users').findOne(query)

    if (!user) {
      throw new Error(getErrorMessage('KDB0010'))
    }

    return user
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
