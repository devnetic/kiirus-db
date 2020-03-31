export default class BaseCommand {
  constructor (method) {
    this.method = method
  }

  getMethod (method) {
    return this.method
  }

  setMethod (method) {
    this.method = method

    return this
  }

  async run (database, options) {
  }
}
