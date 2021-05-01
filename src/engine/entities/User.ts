import { BaseEntity } from './BaseEntity';
import { CollectionInsertOptions, InsertResponse } from './types';
import { getErrorMessage } from './../../support';

export class User extends BaseEntity {
  constructor(protected name: string = 'system') {
    super();
  }

  /**
   * Creates a new user on the database where you run the command. The
   * createUser command returns a duplicate user error if the user exists.
   *
   * @param {*} options
   */
  async create({ document }: CollectionInsertOptions): Promise<InsertResponse> {
    // Select the `system` database
    this.use('system');

    const user = await this.getCollection('users').findOne({
      database: '',
      collection: '',
      query: {
        $and: [{ username: document.username }, { password: document.password }],
      },
    });

    if (user === undefined) {
      throw new Error(getErrorMessage('KDB0003'));
    }

    // select the `users` collection inside the `system` database
    return await this.getCollection('users').insert({ document });
  }
}
