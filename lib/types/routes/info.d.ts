/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from 'http';
import { RouteOptions } from 'fastify';
export declare const info: Array<RouteOptions<Server, IncomingMessage, ServerResponse>>;
