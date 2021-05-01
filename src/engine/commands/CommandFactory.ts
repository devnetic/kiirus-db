import { FastifyReply, FastifyRequest } from 'fastify';
import * as utils from '@devnetic/utils';

import { BaseCommand } from './BaseCommand';
import { CollectionCommand } from './CollectionCommand';
import { Credentials, getCredentials, isAuthorized } from './../auth';
import { Database } from './../entities';
import { DatabaseCommand } from './DatabaseCommand';
import { UserCommand } from './UserCommand';
import { getErrorMessage } from './../../support';

export interface Command {
  command: string;
  action: string;
  options?: any | undefined; // eslint-disable-line
}

export class CommandFactory {
  /**
   *
   * @param {string} command
   * @returns {string}
   */
  protected static formatAction(action: string): string {
    return utils.camelCase(action);
  }

  protected static getCommand(command: string, action: string): BaseCommand {
    switch (command) {
      case 'collection':
        return new CollectionCommand(this.formatAction(action));

      case 'database':
        return new DatabaseCommand(this.formatAction(action));

      case 'user':
        return new UserCommand(this.formatAction(action));

      default:
        throw new Error(getErrorMessage('KDB0002'));
    }
  }

  static async execute(request: FastifyRequest, reply: FastifyReply): Promise<any> { // eslint-disable-line
    const { command, action, options } = request.body as Command;

    // const { username, password }: Credentials = getCredentials(request.headers);

    // console.log('credentials: %o', { username, password });

    // const isAuth = await isAuthorized(username, password, { command, action, options });

    // if (!isAuth) {
    //   throw new Error(getErrorMessage('KDB0014'));
    // }

    const result = await this.getCommand(command, action).run(new Database(getCredentials(request.headers)), options);

    // return result;
    reply.send(result);
  }
}
