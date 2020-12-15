"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runner = void 0;
const builder_1 = require("./builder");
const compiler_1 = require("./compiler");
const parser_1 = require("./parser");
/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const runner = (query, type = 'query', join = ' && ') => {
    return builder_1.build(compiler_1.compile(parser_1.parse(query), type, join), type);
};
exports.runner = runner;
//# sourceMappingURL=runner.js.map