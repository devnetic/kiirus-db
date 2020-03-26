import * as commands from './commands'
import { Database } from './entities'
import { createError } from './../support'

/**
 * Main execution point for the engine
 *
 * @param {IncomingMessage} request
 * @param {Response} response
 */
const run = async (request, response) => {
  try {
    const { command, options } = request.body

    const result = await commands.getCommand(command).run(new Database(), options)

    if (result && result.error) {
      // TODO: log a proper message for this error
      console.log(result)
    }

    response.json(result)
  } catch (e) {
    const error = createError(e.message || e, request)

    const stack = e.stack.split(/\n/g).slice(1).map(line => '  ' + line.trim())

    console.log(`${e.message} - Stack \n[\n%s\n]`, stack.join('\n'))

    response.json(error)
  }
}

export default run
