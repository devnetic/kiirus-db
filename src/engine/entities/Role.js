import path from 'path'

import * as storage from './../storage'
// import { BaseEntity } from './BaseEntity'
import { getErrorMessage } from '../../support'
import { Collection } from './Collection'

export class Role {
  constructor () {
    this.database = 'system'
    this.name = 'roles'
    this.collection = new Collection(this.database, this.name)
  }

  /**
  * Creates a new role on the database where you run the command. The
  * createRole command returns a duplicate user error if the user exists.
  *
  * @param {Object<{body: Object, database: string}} options
  */
  async create (body) {
    await this.collection.init(this.getPath())

    const role = await this.collection.findOne({
      $and: [{ name: { $eq: body.name } }, { database: { $eq: body.database } }]
    })

    if (role) {
      throw new Error(getErrorMessage('KDB0006'))
    }

    // select the `roles` collection inside the `system` database
    return this.collection.insert([body])
  }

  async drop (body) {
    const query = {
      $and: [{ name: { $eq: body.name } }, { database: { $eq: body.database } }]
    }

    const role = await this.collection.findOne(query)

    if (!role) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    return this.collection.delete(query)
  }

  async get (body) {
    const query = {
      $and: [{ name: { $eq: body.name } }, { database: { $eq: body.database } }]
    }

    const role = await this.collection.findOne(query)

    if (!role) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    return role
  }

  async getAll (body) {
    const query = { database: { $eq: body.database } }

    const roles = await this.collection.find(query)

    return roles/* .map(role => {
      const { _id, ...rest } = role

      return rest
    }) */
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
      this.database,
      this.name
    )
  }

  /**
   * Updates a user-defined role. The updateRole command must run on the role’s
   * database.
   *
   * @param {*} options
   */
  async update (body) {
    const role = await this.collection.findOne({
      $and: [{ name: { $eq: body.name } }, { database: { $eq: body.database } }]
    })

    if (!role) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    body.database = role.database

    // select the `roles` collection inside the `system` database
    return this.collection.update([
      { $and: [{ name: { $eq: body.name } }, { database: { $eq: body.database } }] },
      body
    ])
  }
}
