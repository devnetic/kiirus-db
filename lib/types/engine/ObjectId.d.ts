/// <reference types="node" />
export declare class ObjectId {
    protected id: Buffer;
    static index: number;
    constructor();
    /**
     * Update the ObjectId index used in generating new ObjectId's on the driver
     *
     * @method
     * @return {number} returns next index value.
     * @ignore
     */
    static getInc(): number;
    static generate(time?: number): Buffer;
    /**
     * Converts the id into a 24 byte hex string for printing
     *
     * @return {string} return the 24 byte hex string representation.
     * @ignore
     */
    toString(): string;
}
