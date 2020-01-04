const { Database } = require('./../engine')

const { commands } = require('./../engine')
const { createError } = require('./../support')

const routes = [{
  type: 'post',
  path: '/',
  /**
   *
   * @param {IncomingMessage} request
   * @param {Response} response
  */
  handler: async (request, response) => {
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

      console.log(error)

      response.json(error)
    }
  }
}]

module.exports = routes
