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
export const createDir = async (pathname: string, recursive = true, mode = 0o777): Promise<string | undefined> => {
  return await fs.mkdir(pathname, { recursive, mode })
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

  return await fs.rmdir(pathname, { recursive: true })
}

/**
 * Delete a file from the fyle system
 *
 * @param {string} pathname
 *
 * @returns {Promise<boolean|NodeJS.ErrnoException>}
 */
export const deleteFile = async (pathname: string): Promise<void> => {
  return await fs.unlink(pathname)
}

/**
 *
 * @param {string} pathname
 * @param {string} encoding
 * @returns {Promise<object[]>}
 */
export const readDir = async (pathname: string, encoding: BufferEncoding = 'utf8'): Promise<string[]> => {
  return await fs.readdir(pathname, { encoding })
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
  return await fs.readFile(pathname, encoding)
}

/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
export const readJson = async (pathname: string): Promise<unknown> => {
  const data = await readFile(pathname)

  return JSON.parse(data)
}

/**
 * Rename a file or directory
 *
 * @param {string} oldPath
 * @param {string} newPath
 *
 * @returns {Promise<void|NodeJS.ErrnoException>}
 */
export const rename = async (oldPath: string, newPath: string): Promise<void> => {
  return await fs.rename(oldPath, newPath)
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
  pathname: string,
  content: string,
  encoding: BufferEncoding = 'utf8',
  mode = 0o666
): Promise<void> => {
  return await fs.writeFile(pathname, content, { encoding, mode })
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
export const writeJson = async (
  pathname: string,
  content: unknown,
  encoding: BufferEncoding = 'utf8',
  mode = 0o666
): Promise<void> => {
  return await writeFile(pathname, JSON.stringify(content), encoding, mode)
}
