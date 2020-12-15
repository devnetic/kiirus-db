import { FastifyReply, FastifyRequest } from 'fastify'
import * as utils from '@devnetic/utils'

import { BaseCommand } from './BaseCommand'
import { CollectionCommand } from './CollectionCommand'
import { Database } from './../entities'
import { DatabaseCommand } from './DatabaseCommand'
import { getErrorMessage, unexpectedError } from './../../support'

interface Command {
  command: string
  action: string
  options?: object | undefined
}

export class CommandFactory {
  /**
   *
   * @param {string} command
   * @returns {string}
   */
  protected static formatAction (action: string): string {
    return utils.camelCase(action)
  }

  protected static getCommand (command: string, action: string): BaseCommand {
    switch (command) {
      case 'collection':
        return new CollectionCommand(this.formatAction(action))

      case 'database':
        return new DatabaseCommand(this.formatAction(action))

      default:
        throw new Error(getErrorMessage('KDB0005'))
    }
  }

  static async execute (request: FastifyRequest, reply: FastifyReply): Promise<any> {
    const { command, action, options } = request.body as Command

    try {
      const result = await this.getCommand(command, action).run(new Database(), options)

      return result
    } catch (error) {
      const errorMessage = unexpectedError(error.message ?? error, command)

      const stack = error.stack.split(/\n/g).slice(1).map((line: string) => '  ' + line.trim())

      console.log(`${error.message as string} - Stack \n[\n%s\n]`, stack.join('\n'))

      return errorMessage
    }
  }
}
