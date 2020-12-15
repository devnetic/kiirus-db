"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readJson = exports.readFile = exports.readDir = exports.deleteFile = exports.deleteDir = exports.createDir = void 0;
const fs_1 = require("fs");
/**
 * Recursively creates a directory in the hard disk
 *
 * @param {string} pathname
 * @param {boolean} [recursive=true]
 * @param {number} [mode=0o777]
 *
 * @return {Promise<string | undefined>}
 */
const createDir = (pathname, recursive = true, mode = 0o777) => {
    return fs_1.promises.mkdir(pathname, { recursive, mode });
};
exports.createDir = createDir;
/**
* Recursively deletes a directory and all its contents
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
const deleteDir = (pathname) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs_1.promises.access(pathname);
    return fs_1.promises.rmdir(pathname, { recursive: true });
});
exports.deleteDir = deleteDir;
/**
* Delete a file from the fyle system
*
* @param {string} pathname
*
* @returns {Promise<boolean|NodeJS.ErrnoException>}
*/
const deleteFile = (pathname) => {
    return fs_1.promises.unlink(pathname);
};
exports.deleteFile = deleteFile;
/**
 *
 * @param {string} pathname
 * @param {string} encoding
 * @returns {Promise<object[]>}
 */
const readDir = (pathname, encoding = 'utf8') => {
    return fs_1.promises.readdir(pathname, { encoding });
};
exports.readDir = readDir;
/**
 * Read a file from the filesystem, optionally the file can be synchronously
 *
 * @param {string} pathname
 * @param {string} [encoding=utf8]
 *
 * @returns {Promise<string|NodeJS.ErrnoException>}
 */
const readFile = (pathname, encoding = 'utf8') => {
    return fs_1.promises.readFile(pathname, encoding);
};
exports.readFile = readFile;
/**
 * Read a file in JSON format
 *
 * @param {string} pathname
 *
 * @returns {Promsie<object|NodeJS.ErrnoException>}
 */
const readJson = (pathname) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield exports.readFile(pathname);
    return JSON.parse(data);
});
exports.readJson = readJson;
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
const writeFile = (pathname, content, encoding = 'utf8', mode = 0o666) => {
    return fs_1.promises.writeFile(pathname, content, { encoding, mode });
};
exports.writeFile = writeFile;
//# sourceMappingURL=storage.js.map