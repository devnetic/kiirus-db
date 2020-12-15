import { BaseCommonEntity } from './BaseCommonEntity';
import { Collection } from './Collection';
export declare class BaseEntity extends BaseCommonEntity {
    /**
     *
     * @param {string} collection
     * @returns Collection
     */
    getCollection(collection: string): Collection;
    /**
     * Select the given database
     *
     * @param {string} name
     */
    use(name: string): void;
}
