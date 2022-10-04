import { IncomingMessage, Server, ServerResponse } from 'http'

import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify'

import { getUptime } from './../support/stats'

export const info: Array<RouteOptions<Server, IncomingMessage, ServerResponse>> = [
  {
    method: 'GET',
    url: '/info',
    handler: async (request: FastifyRequest, response: FastifyReply): Promise<void> => {
      return await response.send({ uptime: getUptime() })
    }
  }, {
    method: 'GET',
    url: '/info/version',
    handler: async (request: FastifyRequest, response: FastifyReply): Promise<void> => {
      return await response.send({ version: process.env.VERSION })
    }
  }
]
