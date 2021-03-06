import BaseEntity from './BaseEntity'
import { getErrorMessage } from '../../support'

export default class User extends BaseEntity {
  constructor (name = '') {
    super()

    this.name = 'system'
  }

  /**
   * Creates a new user on the database where you run the command. The
   * createUser command returns a duplicate user error if the user exists.
   *
   * @param {*} options
   */
  async create ({ body, database }) {
    // Select the `system` database
    this.use('system')

    const user = await this.getCollection('users').findOne({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })

    if (user) {
      throw new Error(getErrorMessage('KDB0003'))
    }

    body.database = database

    // select the `users` collection inside the `system` database
    return this.getCollection('users').insert([body])
  }

  /**
 * Removes the user from the database on which you run the command.
 *
 * @param {*} options
 */
  async drop ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

    const user = await this.getCollection('users').findOne({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })

    if (!user) {
      throw new Error(getErrorMessage('KDB0004'))
    }

    // select the `users` collection inside the `system` database
    return this.getCollection('users').delete({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })
  }

  async getAll ({ body, database }) {
    // Select the `users` database
    this.use(this.name)

    const query = {
      database: { $eq: database }
    }

    const users = await this.getCollection('users').find(query)

    return users.map(user => {
      const { _id, ...rest } = user

      return rest
    })
  }

  async get ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

    const query = {
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    }

    const user = await this.getCollection('users').findOne(query)

    if (!user) {
      throw new Error(getErrorMessage('KDB0004'))
    }

    return user
  }

  /**
 * Updates the user’s profile on the database on which you run the command. An
 * update to a field completely replaces the previous field’s values,
 * including updates to the user’s roles.
 *
 * @param {*} options
 */
  async update ({ body, database }) {
    this.use(this.name)

    const user = await this.getCollection('users').findOne({
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    })

    if (!user) {
      throw new Error(getErrorMessage('KDB0004'))
    }

    body.database = database

    // select the `users` collection inside the `system` database
    return this.getCollection('users').update([
      { $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }] },
      body
    ])
  }
}
