import { FastifyReply, FastifyRequest } from 'fastify'
import * as utils from '@devnetic/utils'

import { BaseCommand } from './BaseCommand'
import { CollectionCommand } from './CollectionCommand'
import { getCredentials } from './../auth'
import { Database } from './../entities'
import { DatabaseCommand } from './DatabaseCommand'
import { UserCommand } from './UserCommand'
import { getErrorMessage } from './../../support'

export interface Command {
  command: string
  action: string
  options?: any | undefined; // eslint-disable-line
}

export const CommandFactory = {
  /**
   *
   * @param {string} command
   * @returns {string}
   */
  formatAction: (action: string): string => {
    return utils.camelCase(action)
  },

  getCommand: (command: string, action: string): BaseCommand => {
    switch (command) {
      case 'collection':
        return new CollectionCommand(CommandFactory.formatAction(action))

      case 'database':
        return new DatabaseCommand(CommandFactory.formatAction(action))

      case 'user':
        return new UserCommand(CommandFactory.formatAction(action))

      default:
        throw new Error(getErrorMessage('KDB0002'))
    }
  },

  execute: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { command, action, options } = request.body as Command

    // const { username, password }: Credentials = getCredentials(request.headers);

    // console.log('credentials: %o', { username, password });

    // const isAuth = await isAuthorized(username, password, { command, action, options });

    // if (!isAuth) {
    //   throw new Error(getErrorMessage('KDB0014'));
    // }

    const result = await CommandFactory
      .getCommand(command, action)
      .run(
        new Database(getCredentials(request.headers)),
        options
      )

    // return result;
    return await reply.send(result)
  }
}
