import { Database } from './../entities'

export abstract class BaseCommand {
  constructor (protected action: string) {}

  getAction (): string {
    return this.action
  }

  setAction (action: string): this {
    this.action = action

    return this
  }

  abstract run (database: Database, options: unknown): Promise<unknown>
}
