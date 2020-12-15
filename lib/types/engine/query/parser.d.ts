export interface Token {
    type: string;
    operator: string;
    operand?: string;
    value?: unknown;
    children?: Array<Token>;
}
/**
 *
 * @param {Object} query
 * @returns {Array<Token>}
 */
export declare const parse: (query: ArrayLike<any>) => Array<Token>;
