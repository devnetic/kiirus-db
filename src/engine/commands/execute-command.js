import * as commands from './'
import { createError } from '../../support'
import { Database } from '../entities'

/**
 * Main execution point for the engine
 *
 * @param {IncomingMessage} request
 * @param {Response} response
 */
export const executeCommand = async (request, response) => {
  try {
    const { command, action, options } = request.body

    const result = await commands.getCommand(command, action).run(new Database(), options)

    response.send(result)
  } catch (error) {
    const errorMessage = createError(error.message || error, request.body.command)

    const stack = error.stack.split(/\n/g).slice(1).map(line => '  ' + line.trim())

    console.log(`${error.message} - Stack \n[\n%s\n]`, stack.join('\n'))

    response.send(errorMessage)
  }
}
