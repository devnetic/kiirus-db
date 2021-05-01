import { IncomingMessage, Server, ServerResponse } from 'http';

import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

import { getUptime } from './../support/stats';

export const info: Array<RouteOptions<Server, IncomingMessage, ServerResponse>> = [
  {
    method: 'GET',
    url: '/info',
    handler: (request: FastifyRequest, response: FastifyReply): void | Promise<void> => {
      response.send({ uptime: getUptime() });
    },
  },
];
