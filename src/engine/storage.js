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
