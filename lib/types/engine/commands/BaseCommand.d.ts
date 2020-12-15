import { Database } from './../entities';
export declare abstract class BaseCommand {
    protected action: string;
    constructor(action: string);
    getAction(): string;
    setAction(action: string): this;
    run(database: Database, options: unknown): Promise<void>;
}
