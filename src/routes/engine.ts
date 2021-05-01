import { IncomingMessage, Server, ServerResponse } from 'http';

import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

import { CommandFactory } from '../engine/commands';
import { logger } from './../support';

export const engine: Array<RouteOptions<Server, IncomingMessage, ServerResponse>> = [
  {
    method: 'POST',
    url: '/',
    handler: async (request: FastifyRequest, response: FastifyReply): Promise<void> => {
      try {
        const result = await CommandFactory.execute(request, response);

        response.code(200).header('Content-Type', 'application/json; charset=utf-8').send(result);
      } catch (error) {
        const stack: string[] = error.stack.split('\n');
        const result = stack[1].trim().match(/\((.+)\|at (.+))/);

        logger(`${error.message as string} at ${result !== null ? result[1] : ''}`, 'error');

        response.code(500).send(error);
      }
    },
  },
];
