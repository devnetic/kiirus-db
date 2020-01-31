const path = require('path')

const { storage } = require('./../support')

const createRolesCollection = () => {
  // system roles collection
  const pathname = path.join(process.env.DB_PATH, 'system', 'roles')

  return storage.createDir(pathname, true, 0o766)
}

const createUsersCollection = () => {
  // system users collection
  const pathname = path.join(process.env.DB_PATH, 'system', 'users')

  return storage.createDir(pathname, true, 0o766)
}

/**
 * Create the system databases and collections
 */
const initEngine = async () => {
  try {
    const roles = await createRolesCollection()

    const users = await createUsersCollection()

    return roles && users
  } catch (error) {
    const stack = error.stack.split(/\n/g).slice(1).map(line => '  ' + line.trim())

    console.log(`${error.message} - Stack \n[\n%s\n]`, stack.join('\n'))

    return false
  }
}

module.exports = initEngine
