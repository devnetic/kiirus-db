import path from 'path';
import { performance } from "perf_hooks";

import * as storage from './../storage';
import { BaseEntity } from './BaseEntity';
import { UpdateResponse } from './types';
import { getErrorMessage } from './../../support';
import { Credentials } from './../auth';

export interface DatabaseOptions {
  database: string;
}

interface DatabaseRenameOptions extends DatabaseOptions {
  target: string;
}

const IsAuth = () => (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log((this as Database).getCredentials());

    const result = originalMethod.apply(this, args);

    return result;
  };

  return descriptor;
};

export class Database extends BaseEntity {
  constructor(protected readonly crendentials: Credentials) {
    super();

    this.init(this.getPath());
  }

  public getCredentials (): Credentials {
    return this.crendentials;
  }

  async list(): Promise<string[]> {
    return await storage.readDir(process.env.DB_PATH ?? '');
  }

  @IsAuth()
  async rename({ target }: DatabaseRenameOptions): Promise<UpdateResponse> {
    try {
      const newPathname = path.join(process.env.DB_PATH ?? '', target);

      await storage.rename(this.getPath(), newPathname);

      const response: UpdateResponse = {
        nModified: 1,
      };

      return response;
    } catch (error) {
      throw new Error(getErrorMessage('KDB0006', error.message));
    }
  }
}
