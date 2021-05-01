import { BaseCommonEntity } from './BaseCommonEntity';
import { Collection } from './Collection';

export class BaseEntity extends BaseCommonEntity {
  /**
   *
   * @param {string} collection
   * @returns Collection
   */
  getCollection(collection: string): Collection {
    return new Collection(this.name, collection);
  }

  /**
   * Select the given database
   *
   * @param {string} name
   */
  use(name: string): void {
    this.name = name;
  }
}
