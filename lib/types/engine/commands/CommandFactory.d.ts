import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseCommand } from './BaseCommand';
export declare class CommandFactory {
    /**
     *
     * @param {string} command
     * @returns {string}
     */
    protected static formatAction(action: string): string;
    protected static getCommand(command: string, action: string): BaseCommand;
    static execute(request: FastifyRequest, reply: FastifyReply): Promise<string | void | {
        error: string;
    }>;
}
