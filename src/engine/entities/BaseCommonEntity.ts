import path from 'path';

import * as storage from './../storage';
import { getErrorMessage } from './../../support';

export abstract class BaseCommonEntity {
  protected name = '';

  async drop(database: string): Promise<boolean> {
    try {
      await storage.deleteDir(this.getPath(database));

      return true;
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message));
    }
  }

  /**
   * Return the collection path
   *
   * @param {string} [database]
   * @returns {string}
   * @memberof Collection
   */
  getPath(database?: string): string {
    return path.join(process.env.DB_PATH ?? '', database ?? this.name);
  }

  /**
   * Create the collection and the database directories if they don't exist
   *
   * @param {*} pathname
   * @returns Promise<boolean>
   * @memberof Collection
   */
  async init(pathname: string): Promise<string | undefined> {
    try {
      return await storage.createDir(pathname, true, 0o766);
    } catch (error) {
      if ((error.message ?? error).indexOf('EEXIST') === -1) {
        throw new Error(error);
      }
    }
  }
}
