import * as storage from './../storage'

export class CommonEntity {
  async drop (options) {
    try {
      await storage.deleteDir(this.getPath())

      return true
    } catch (error) {
      throw new Error(this.getError(error))
    }
  }

  getError (error) {
    if (!error.code) {
      return error
    }

    switch (error.code) {
      case 'ENOENT':
        return `'${this.name}' ${this.constructor.name.toLowerCase()} doesn't exist`
    }
  }
}
