import { Collection } from './Collection'
import { CommonEntity } from './CommonEntity'

export class BaseEntity extends CommonEntity {
  /**
   *
   * @param {string} collection
   * @returns Collection
   */
  getCollection (collection) {
    return new Collection(this.name, collection)
  }

  /**
   * Select the given database
   *
   * @param {string} name
   */
  use (name) {
    this.name = name
  }
}
