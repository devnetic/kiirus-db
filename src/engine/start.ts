import path from 'path'

import * as storage from './storage'
import { Collection } from './entities'

/**
 * Create the roles collection
 *
 * @returns {boolean}
 */
const createRolesCollection = async (): Promise<boolean> => {
  try {
    const pathname = path.join(process.env.DB_PATH ?? '', 'system', 'roles')

    await storage.readDir(pathname)
  } catch (error: any) {
    // const actions = [
    //   'count',
    //   'delete',
    //   'find',
    //   'findOne',
    //   'insert',
    //   'list',
    //   'rename',
    //   'update'
    // ]
    const actions = ['create']

    // system roles collection
    const collection = new Collection('system', 'roles')

    await collection.insert({
      document: {
        name: 'admin',
        privileges: [
          {
            database: 'system',
            collection: 'users',
            actions
          },
          {
            database: 'system',
            collection: 'roles',
            actions
          }
        ]
      }
    })
  }

  return true
}

/**
 * Create the users collection
 *
 * @returns {boolean}
 */
const createUsersCollection = async (): Promise<boolean> => {
  try {
    const pathname = path.join(process.env.DB_PATH ?? '', 'system', 'users')

    await storage.readDir(pathname)
  } catch (error: any) {
    const collection = new Collection('system', 'users')

    await collection.insert({
      document: {
        username: 'root',
        password: 'root',
        roles: ['admin']
      }
    })
  }

  return true
}

/**
 * Create the system databases and collections
 */
export const startEngine = async (): Promise<true> => {
  await createRolesCollection()
  await createUsersCollection()

  return true
}
