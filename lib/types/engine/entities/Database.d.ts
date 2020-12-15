import { BaseEntity } from './BaseEntity';
export declare class Database extends BaseEntity {
    constructor();
    list(): Promise<string[]>;
}
