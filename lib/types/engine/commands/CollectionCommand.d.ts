import { BaseCommand } from './BaseCommand';
import { CollectionOptions, Database } from './../entities';
export declare class CollectionCommand extends BaseCommand {
    run(database: Database, options: CollectionOptions): Promise<any>;
}
