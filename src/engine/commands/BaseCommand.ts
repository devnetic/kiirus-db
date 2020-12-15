import { Database } from './../entities'

export abstract class BaseCommand {
  constructor (protected action: string) {}

  getAction (): string {
    return this.action
  }

  setAction(action: string) {
    this.action = action

    return this
  }

  async run(database: Database, options: unknown) { }
}
