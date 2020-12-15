import { BaseCommand } from './BaseCommand';
import { Database } from './../entities';
interface DatabaseOptions {
    database?: string;
    name?: string;
}
export declare class DatabaseCommand extends BaseCommand {
    /**
     *
     * @param {Database} database
     * @param {Options} options
     */
    run(database: Database, options?: DatabaseOptions): Promise<any>;
}
export {};
