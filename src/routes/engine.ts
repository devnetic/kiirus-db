import { IncomingMessage, Server, ServerResponse } from 'http'

import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify'

import { CommandFactory } from '../engine/commands'
import { logger } from './../support'

export const engine: Array<RouteOptions<Server, IncomingMessage, ServerResponse>> = [{
  method: 'POST',
  url: '/',
  handler: async (request: FastifyRequest, response: FastifyReply) => {
    try {
      const result = await CommandFactory.execute(request, response)

      return response
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(result)
    } catch (error) {
      logger(error.message, 'error')

      response.code(500).send(error)
    }
  }
}]
