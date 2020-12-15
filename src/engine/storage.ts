import { promises as fs } from 'fs'

/**
 * Recursively creates a directory in the hard disk
 *
 * @param {string} pathname
 * @param {boolean} [recursive=true]
 * @param {number} [mode=0o777]
 *
 * @return {Promise<string | undefined>}
 */
export const createDir = async (
  pathname: string, recursive: boolean = true, mode: number = 0o777
): Promise<string | undefined> => {
  return fs.mkdir(pathname, { recursive, mode })
}

/**
* Recursively deletes a directory and all its contents
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
export const deleteDir = async (pathname: string): Promise<void> => {
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
export const deleteFile = async (pathname: string): Promise<void> => {
  return fs.unlink(pathname)
}

/**
 *
 * @param {string} pathname
 * @param {string} encoding
 * @returns {Promise<object[]>}
 */
export const readDir = async (pathname: string, encoding: BufferEncoding = 'utf8'): Promise<string[]> => {
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
export const readFile = async (pathname: string, encoding: BufferEncoding = 'utf8'): Promise<string> => {
  return fs.readFile(pathname, encoding)
}

/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
export const readJson = async (pathname: string): Promise<any> => {
  const data = await readFile(pathname)

  return JSON.parse(data)
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
export const writeFile = async (
  pathname: string, content: string, encoding: BufferEncoding = 'utf8',
  mode: number = 0o666
): Promise<void> => {
  return fs.writeFile(pathname, content, { encoding, mode })
}
