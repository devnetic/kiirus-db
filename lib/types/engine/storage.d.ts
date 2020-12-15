/// <reference types="node" />
/**
 * Recursively creates a directory in the hard disk
 *
 * @param {string} pathname
 * @param {boolean} [recursive=true]
 * @param {number} [mode=0o777]
 *
 * @return {Promise<string | undefined>}
 */
export declare const createDir: (pathname: string, recursive?: boolean, mode?: number) => Promise<string | undefined>;
/**
* Recursively deletes a directory and all its contents
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
export declare const deleteDir: (pathname: string) => Promise<void>;
/**
* Delete a file from the fyle system
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
export declare const deleteFile: (pathname: string) => Promise<void>;
/**
 *
 * @param {string} pathname
 * @param {string} encoding
 * @returns {Promise<object[]>}
 */
export declare const readDir: (pathname: string, encoding?: BufferEncoding) => Promise<string[]>;
/**
 * Read a file from the filesystem, optionally the file can be synchronously
 *
 * @param {string} pathname
 * @param {string} [encoding=utf8]
 *
 * @returns {Promise<string|NodeJS.ErrnoException>}
 */
export declare const readFile: (pathname: string, encoding?: BufferEncoding) => Promise<string>;
/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
export declare const readJson: (pathname: string) => Promise<any>;
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
export declare const writeFile: (pathname: string, content: string, encoding?: BufferEncoding, mode?: number) => Promise<void>;
