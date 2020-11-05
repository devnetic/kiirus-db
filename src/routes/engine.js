import { executeCommand } from './../engine'

export const engine = [{
  type: 'post',
  path: '/',
  /**
   *
   * @param {IncomingMessage} request
   * @param {Response} response
  */
  handler: (request, response) => {
    executeCommand(request, response)
  }
}]
