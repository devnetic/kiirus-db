"use strict";
// https://github.com/mongodb/js-bson/blob/master/lib/objectid.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
// constants
const PROCESS_UNIQUE = crypto_1.default.randomBytes(5);
class ObjectId {
    constructor() {
        this.id = ObjectId.generate();
    }
    /**
     * Update the ObjectId index used in generating new ObjectId's on the driver
     *
     * @method
     * @return {number} returns next index value.
     * @ignore
     */
    static getInc() {
        return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
    }
    static generate(time) {
        if (typeof time !== 'number') {
            time = ~~(Date.now() / 1000);
        }
        const inc = ObjectId.getInc();
        const buffer = buffer_1.Buffer.alloc(12);
        // 4-byte timestamp
        buffer[3] = time & 0xff;
        buffer[2] = (time >> 8) & 0xff;
        buffer[1] = (time >> 16) & 0xff;
        buffer[0] = (time >> 24) & 0xff;
        // 5-byte process unique
        buffer[4] = PROCESS_UNIQUE[0];
        buffer[5] = PROCESS_UNIQUE[1];
        buffer[6] = PROCESS_UNIQUE[2];
        buffer[7] = PROCESS_UNIQUE[3];
        buffer[8] = PROCESS_UNIQUE[4];
        // 3-byte counter
        buffer[11] = inc & 0xff;
        buffer[10] = (inc >> 8) & 0xff;
        buffer[9] = (inc >> 16) & 0xff;
        return buffer;
    }
    /**
     * Converts the id into a 24 byte hex string for printing
     *
     * @return {string} return the 24 byte hex string representation.
     * @ignore
     */
    toString() {
        return this.id.toString('hex');
    }
}
exports.ObjectId = ObjectId;
ObjectId.index = ~~(Math.random() * 0xffffff);
//# sourceMappingURL=ObjectId.js.map