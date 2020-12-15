"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const common_1 = require("./common");
/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const build = (compiled, type = 'query') => {
    const functionBody = type === 'query' ? `return ${compiled || true}` : `${compiled}; return ${common_1.RECORD_NAME};`;
    if (process.env.LOG_QUERIES === 'true') {
        console.log('query: %o', functionBody);
    }
    return new Function(common_1.RECORD_NAME, 'isEqual', 'getType', `'use strict'; ${functionBody}`); // eslint-disable-line
};
exports.build = build;
//# sourceMappingURL=builder.js.map