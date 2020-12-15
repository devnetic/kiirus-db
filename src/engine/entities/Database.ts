import { BaseEntity } from './BaseEntity'
import * as storage from './../storage'

export class Database extends BaseEntity {
  constructor () {
    super()

    this.init(this.getPath())
  }

  async list (): Promise<string[]> {
    return storage.readDir(process.env.DB_PATH ?? '')
  }
}
