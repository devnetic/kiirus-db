import { IncomingHttpHeaders } from 'http'

import { getErrorMessage } from './../support'
import { Command } from './commands'
import { Collection } from './entities'

export interface Credentials {
  username: string
  password: string
}

export interface Actions {
  read: string[]
  write: string[]
  readWrite: string[]
}

export const getActions = (name: keyof Actions): string[] => {
  const read = ['count', 'find', 'findOne', 'list']
  const write = ['delete', 'drop', 'insert', 'rename', 'update']

  const actions: Actions = {
    read,
    write,
    readWrite: read.concat(write)
  }

  return Reflect.get(actions, name)
}

export const getCredentials = (headers: IncomingHttpHeaders): Credentials => {
  const authorization = headers.authorization ?? ''

  if (!authorization || authorization?.indexOf('Basic ') === -1) {
    throw new Error(getErrorMessage('KDB0007'))
  }


  const credentials = Buffer.from(authorization.split(' ')[1], 'base64').toString()
  const [username, password] = credentials.split(':')

  return {
    username,
    password
  }
}

export const isAuthorized = async (username: string, password: string, body: Command): Promise<boolean> => {
  const { command, action, options } = body

  let collection = new Collection('system', 'users')

  const user = await collection.findOne({
    database: 'system',
    collection: 'users',
    query: {
      username,
      password
    }
  })

  console.log('user: %o', user)

  if (user.roles.length === 0) {
    return false
  }

  collection = new Collection('system', 'roles')

  const roles = await collection.find({
    query: {
      name: { $in: user.roles },
      // database: options.database
      privileges: { $filter: { database: options.database } }
      // 'privileges[index].database': options.database
    }
  })

  if (roles.length === 0) {
    return false
  }

  console.log('roles: %o', roles)

  return true
}
