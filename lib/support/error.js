"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unexpectedError = exports.getErrorMessage = void 0;
const utils = __importStar(require("@devnetic/utils"));
/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @param {string} message
 * @returns {string}
 */
const getErrorMessage = (code, message = '') => {
    var _a;
    return `${code}: ${(_a = process.env[code]) === null || _a === void 0 ? void 0 : _a.replace('{{}}', message ? ` [${message}]` : '')} - ${utils.dateFormat(new Date(), 'YYYY-MM-dd HH:mm:ss')}`;
};
exports.getErrorMessage = getErrorMessage;
/**
 *
 * @param {string} error
 * @param {string} command
 * @returns {Object}
 */
const unexpectedError = (error, command) => {
    if (error.includes('is not a function')) {
        return exports.getErrorMessage('KDB0002');
    }
    return { error };
};
exports.unexpectedError = unexpectedError;
//# sourceMappingURL=error.js.map