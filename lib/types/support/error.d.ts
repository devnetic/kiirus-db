/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @param {string} message
 * @returns {string}
 */
export declare const getErrorMessage: (code: string, message?: string) => string;
/**
 *
 * @param {string} error
 * @param {string} command
 * @returns {Object}
 */
export declare const unexpectedError: (error: string, command: string) => string | {
    error: string;
};
