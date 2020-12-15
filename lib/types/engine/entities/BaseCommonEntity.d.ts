/// <reference types="node" />
export declare abstract class BaseCommonEntity {
    protected name: string;
    drop(database: string): Promise<boolean>;
    /**
     * Return the collection path
     *
     * @param {string} [database]
     * @returns {string}
     * @memberof Collection
     */
    getPath(database?: string): string;
    /**
     * Create the collection and the database directories if they don't exist
     *
     * @param {*} pathname
     * @returns Promise<boolean>
     * @memberof Collection
     */
    init(pathname: string): Promise<string | true | Error | undefined>;
    getError(error: NodeJS.ErrnoException): string;
}
