const fs = require('fs')
const path = require('path')
const util = require('util')

/**
 * Recursively creates a directory in the hard disk
 *
 * @param {string} pathname
 * @param {boolean} [recursive=true]
 * @param {number} [mode=0o777]
 *
 * @return {Promise<boolean|string>}
 */
const createDir = (pathname, recursive = true, mode = 0o777) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathname, { recursive, mode }, (error) => {
      if (error) {
        reject(error)
      }

      resolve(true)
    })
  })
}

/**
* Recursively deletes a directory and all its contents
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
const deleteDir = (pathname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathname, { withFileTypes: true }, (error, files) => {
      if (error) {
        return reject(error)
      }

      // TODO: Refactor with async/await
      Promise.all(files.map((file) => {
        if (file.isDirectory()) {
          return deleteDir(path.join(pathname, file.name))
        }

        return deleteFile(path.join(pathname, file.name))
      })).then(() => {
        fs.rmdir(pathname, (error) => {
          if (error) {
            return reject(error)
          }

          resolve(true)
        })
      }).catch(reject)
    })
  })
}

/**
* Delete a file from the fyle system
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
const deleteFile = (pathname) => {
  return new Promise((resolve, reject) => {
    fs.unlink(pathname, (error) => {
      if (error) {
        reject(error)
      }

      resolve(true)
    })
  })
}

const readDir = (pathname, sync = false, encoding = 'utf8') => {
  if (sync) {
    try {
      return Promise.resolve(fs.readdir(pathname))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return new Promise((resolve, reject) => {
    fs.readdir(pathname, { encoding }, (error, data) => {
      if (error) {
        reject(error)
      }

      resolve(data)
    })
  })
}

/**
 * Read a file from the filesystem, optionally the file can be synchronously
 *
 * @param {string} pathname
 * @param {boolean} [sync=false]
 * @param {string} [encoding=utf8]
 *
 * @returns {Promise<string|NodeJS.ErrnoException>}
 */
const readFile = (pathname, sync = false, encoding = 'utf8') => {
  if (sync) {
    try {
      return Promise.resolve(fs.readFileSync(pathname, encoding))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return new Promise((resolve, reject) => {
    fs.readFile(pathname, encoding, (error, data) => {
      if (error) {
        reject(error)
      }

      resolve(data)
    })
  })
}

/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 * @param {boolean} [sync=false]
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
const readJson = async (pathname, sync = false) => {
  const data = await readFile(pathname, sync)

  return JSON.parse(data)
}

/**
 * Rename a file or directory
 *
 * @param {string} oldPath
 * @param {string} newPath
 * @param {boolean} [sync=false]
 *
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 */
const rename = (oldPath, newPath, sync = false) => {
  if (sync) {
    try {
      return Promise.resolve(fs.renameSync(oldPath, newPath))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const rename = util.promisify(fs.rename)

  return rename(oldPath, newPath)
  // return new Promise((resolve, reject) => {
  //   fs.rename(oldPath, newPath, async (error) => {
  //     if (error) {
  //       reject(new Error(error))
  //     }

  //     resolve(true)
  //   })
  // })
}

/**
 * Write to a file the given content
 *
 * @param {string} pathname
 * @param {string} content
 * @param {string} [encoding=utf8]
 * @param {string} [mode=0o666]
 *
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 */
const writeFile = (pathname, content, sync = false, encoding = 'utf8', mode = 0o666) => {
  if (sync) {
    try {
      fs.writeFileSync(pathname, content, { encoding, mode })

      return Promise.resolve(true)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(pathname, content, { encoding, mode }, async (error) => {
      if (error) {
        reject(error)
      }

      resolve(true)
    })
  })
}

/**
 * Write to a file in JSON format the given object
 *
 * @param {string} pathname
 * @param {Object} content
 * @param {string} [encoding=utf8]
 * @param {string} [mode=0o666]
 *
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 */
const writeJson = (pathname, content, sync = false, encoding = 'utf8', mode = 0o666) => {
  return writeFile(pathname, JSON.stringify(content), sync, encoding, mode)
}

module.exports = {
  createDir,
  deleteDir,
  deleteFile,
  readDir,
  readFile,
  readJson,
  rename,
  writeFile,
  writeJson
}
