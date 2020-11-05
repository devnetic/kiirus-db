export class BaseCommand {
  constructor (action) {
    this.action = action
  }

  getAction (action) {
    return this.action
  }

  setAction (action) {
    this.action = action

    return this
  }

  async run (database, options) { }
}
