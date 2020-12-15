import { BaseCommonEntity } from './BaseCommonEntity';
interface WriteError {
    code: number;
    message: string;
}
interface WriteResponse {
    nInserted: number;
    writeError?: WriteError;
}
export interface CollectionOptions {
    database: string;
    collection: string;
}
interface CollectionDeleteOptions extends CollectionOptions {
    query: object;
}
interface CollectionInsertOptions extends CollectionOptions {
    documents: Array<any>;
}
export declare class Collection extends BaseCommonEntity {
    protected database: string;
    private extension;
    private query;
    private records;
    /**
     *
     * @param {string} database
     * @param {string} name
     */
    constructor(database: string, name?: string);
    /**
     * Perform a cipher over the data
     *
     * @param {*} data
     * @returns {string}
     * @memberof Collection
     */
    cipher(data: any): string;
    /**
     * Delete one or many records from the collection using a query
     *
     * @param {Function|Object} query
     *
     * @return Promise<Object>
     */
    delete({ query }: CollectionDeleteOptions): Promise<{
        deletedCount: number;
    }>;
    /**
     * Return the collection path
     *
     * @returns {string}
     * @memberof Collection
     */
    getPath(): string;
    /**
     * Read a set of files from the collection path
     *
     * @param {Function} query
     * @returns {Promise<array>}
     */
    getRecords(query: Function): Promise<Array<any>>;
    /**
     * Insert a data set into the collection
     *
     * @param {Array<Object>} data
     * @return {Promise<boolean>}
     */
    insert({ documents }: CollectionInsertOptions): Promise<WriteResponse>;
    /**
     * Write a ate set to a given collection and return the records ids
     *
     * @param {string} collection
     * @param {array} data
     *
     * @return {Promise<array>}
     */
    write(collection: string, data: Array<any>): Promise<WriteResponse>;
}
export {};
