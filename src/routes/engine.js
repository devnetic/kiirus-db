const { run } = require('./../engine')

const routes = [{
  type: 'post',
  path: '/',
  /**
   *
   * @param {IncomingMessage} request
   * @param {Response} response
  */
  handler: (request, response) => {
    run(request, response)
  }
}]

module.exports = routes
