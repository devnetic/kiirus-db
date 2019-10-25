// const { Database } = require('./../engine')

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
      const result = await commands.run(request)

      response.json(result)
    } catch (e) {
      // TODO: return a proper message for more error types
      response.json(createError(e, request))
    }
  }
}]

module.exports = routes
