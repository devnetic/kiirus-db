import path from 'path'

import * as storage from './../storage'
import { BaseEntity } from './BaseEntity'
import { UpdateResponse } from './types'
import { getErrorMessage } from './../../support'

export interface DatabaseOptions {
  database: string
}

interface DatabaseRenameOptions extends DatabaseOptions {
  target: string
}

export class Database extends BaseEntity {
  constructor () {
    super()

    this.init(this.getPath())
  }

  async list (): Promise<string[]> {
    return storage.readDir(process.env.DB_PATH ?? '')
  }

  async rename ({ target }: DatabaseRenameOptions): Promise<UpdateResponse> {
    try {
      const newPathname = path.join(
        process.env.DB_PATH ?? '',
        target
      )

      await storage.rename(this.getPath(), newPathname)

      const response: UpdateResponse = {
        nModified: 1
      }

      return response
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message))
    }
  }
}
