"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const path_1 = __importDefault(require("path"));
const utils = __importStar(require("@devnetic/utils"));
const BaseCommonEntity_1 = require("./BaseCommonEntity");
const query_1 = require("./../query");
const ObjectId_1 = require("./../ObjectId");
const storage = __importStar(require("./../storage"));
class Collection extends BaseCommonEntity_1.BaseCommonEntity {
    /**
     *
     * @param {string} database
     * @param {string} name
     */
    constructor(database, name = '') {
        super();
        this.database = database;
        this.records = [];
        this.extension = '.json';
        this.name = name;
        this.query = { run: query_1.runner };
        this.records = [];
    }
    /**
     * Perform a cipher over the data
     *
     * @param {*} data
     * @returns {string}
     * @memberof Collection
     */
    cipher(data) {
        return data;
    }
    /**
     * Delete one or many records from the collection using a query
     *
     * @param {Function|Object} query
     *
     * @return Promise<Object>
     */
    delete({ query }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield this.getRecords(this.query.run(query));
                const response = {
                    deletedCount: 0
                };
                for (const record of records) {
                    const result = yield storage.deleteFile(record.file);
                    if (result === undefined) {
                        response.deletedCount += 1;
                    }
                }
                return response;
            }
            catch (error) {
                throw new Error(this.getError(error));
            }
        });
    }
    /**
     * Return the collection path
     *
     * @returns {string}
     * @memberof Collection
     */
    getPath() {
        var _a;
        return path_1.default.join((_a = process.env.DB_PATH) !== null && _a !== void 0 ? _a : '', this.database, this.name);
    }
    /**
     * Read a set of files from the collection path
     *
     * @param {Function} query
     * @returns {Promise<array>}
     */
    getRecords(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathname = this.getPath();
            try {
                const files = yield storage.readDir(pathname);
                const records = [];
                for (let file of files) {
                    file = path_1.default.join(pathname, file);
                    const data = yield storage.readJson(file);
                    if (query(data) === true) {
                        records.push({ file, data });
                    }
                }
                return records;
            }
            catch (error) {
                throw new Error(this.getError(error));
            }
        });
    }
    /**
     * Insert a data set into the collection
     *
     * @param {Array<Object>} data
     * @return {Promise<boolean>}
     */
    insert({ documents }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pathname = this.getPath();
                yield this.init(pathname);
                return this.write(pathname, documents);
            }
            catch (error) {
                throw new Error(this.getError(error));
            }
        });
    }
    /**
     * Write a ate set to a given collection and return the records ids
     *
     * @param {string} collection
     * @param {array} data
     *
     * @return {Promise<array>}
     */
    write(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                nInserted: 0
            };
            for (const record of data) {
                // a 4 - byte value representing the seconds since the Unix epoch,
                // a 5 - byte random value, and
                // a 3 - byte counter, starting with a random value.
                if (record._id === undefined) {
                    record._id = new ObjectId_1.ObjectId().toString();
                }
                try {
                    yield storage.writeFile(path_1.default.join(collection, utils.uuid() + this.extension), this.cipher(JSON.stringify(record)));
                    response.nInserted += 1;
                }
                catch (error) {
                    response.writeError = {
                        code: error.name,
                        message: error.message
                    };
                }
            }
            return response;
        });
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map