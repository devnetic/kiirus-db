import Collection from './Collection'

export default class BaseEntity {
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
