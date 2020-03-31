import { run } from './../engine'

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

export default routes
