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

      if (result && result.error) {
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
