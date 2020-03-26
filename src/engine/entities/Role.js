import BaseEntity from './BaseEntity'
import { getErrorMessage } from '../../support'

export default class Role extends BaseEntity {
  constructor () {
    super()

    this.name = 'system'
  }

  /**
  * Creates a new role on the database where you run the command. The
  * createRole command returns a duplicate user error if the user exists.
  *
  * @param {Object<{body: Object, database: string}} options
  */
  async create ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

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

  async drop ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

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

  async getAll ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

    const query = {
      database: { $eq: database }
    }

    const roles = await this.getCollection('roles').find(query)

    return roles.map(role => {
      const { _id, ...rest } = role

      return rest
    })
  }

  async get ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

    const query = {
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    }

    const role = await this.getCollection('roles').findOne(query)

    if (!role) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    return role
  }

  grantRolesToUser ({ body, database }) {
    // Select the `system` database
    this.use('system')

    return this.getCollection('users').update([{
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    }, {
      roles: { $push: body.roles }
    }])
  }

  revokeRolesFromUser ({ body, database }) {
    // Select the `system` database
    this.use(this.name)

    return this.getCollection('users').update([{
      $and: [{ username: { $eq: body.username } }, { database: { $eq: database } }]
    }, {
      roles: { $pull: body.roles }
    }])
  }

  /**
   * Updates a user-defined role. The updateRole command must run on the role’s
   * database.
   *
   * @param {*} options
   */
  async update ({ body, database }) {
    this.use(this.name)

    const role = await this.getCollection('roles').findOne({
      $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }]
    })

    if (!role) {
      throw new Error(getErrorMessage('KDB0009'))
    }

    body.database = role.database

    // select the `roles` collection inside the `system` database
    return this.getCollection('roles').update([
      { $and: [{ name: { $eq: body.name } }, { database: { $eq: database } }] },
      body
    ])
  }
}
