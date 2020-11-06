import { promises as fs } from 'fs'

/**
 * Recursively creates a directory in the hard disk
 *
 * @param {string} pathname
 * @param {boolean} [recursive=true]
 * @param {number} [mode=0o777]
 *
 * @return {Promise<boolean|string>}
 */
export const createDir = (pathname, recursive = true, mode = 0o777) => {
  return fs.mkdir(pathname, { recursive, mode })
}

/**
* Recursively deletes a directory and all its contents
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
export const deleteDir = async (pathname) => {
  await fs.access(pathname)

  return fs.rmdir(pathname, { recursive: true })
}

/**
* Delete a file from the fyle system
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
export const deleteFile = (pathname) => {
  return fs.unlink(pathname)
}

/**
 *
 * @param {string} pathname
 * @param {string} encoding
 * @returns {Promise<object[]>}
 */
export const readDir = (pathname, encoding = 'utf8') => {
  return fs.readdir(pathname, { encoding })
}

/**
 * Read a file from the filesystem, optionally the file can be synchronously
 *
 * @param {string} pathname
 * @param {string} [encoding=utf8]
 *
 * @returns {Promise<string|NodeJS.ErrnoException>}
 */
export const readFile = (pathname, encoding = 'utf8') => {
  return fs.readFile(pathname, encoding)
}

/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
export const readJson = async (pathname) => {
  const data = await readFile(pathname)

  return JSON.parse(data)
}

/**
 * Rename a file or directory
 *
 * @param {string} oldPath
 * @param {string} newPath
 *
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 */
export const rename = (oldPath, newPath) => {
  return fs.rename(oldPath, newPath)
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
export const writeFile = (pathname, content, encoding = 'utf8', mode = 0o666) => {
  return fs.writeFile(pathname, content, { encoding, mode })
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
export const writeJson = (pathname, content, encoding = 'utf8', mode = 0o666) => {
  return writeFile(pathname, JSON.stringify(content), encoding, mode)
}
