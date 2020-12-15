import { ComplexOperator } from './common';
import { Token } from './parser';
/**
 *
 * @param {Array<Token>} syntaxTree
 * @param {string} [type='query|aggregation']
 * @param {string} [join='&&']
 * @returns {string}
 */
export declare const compile: (syntaxTree?: Array<Token>, commandType?: string, join?: ComplexOperator | string) => string;
