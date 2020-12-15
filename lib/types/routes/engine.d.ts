/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from 'http';
import { RouteOptions } from 'fastify';
export declare const engine: Array<RouteOptions<Server, IncomingMessage, ServerResponse>>;
