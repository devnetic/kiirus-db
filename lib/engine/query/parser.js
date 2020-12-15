"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const common_1 = require("./common");
/**
 *
 * @param {*} item
 * @returns {string}
 */
const getItemType = (item) => {
    if (Array.isArray(item)) {
        return 'array';
    }
    else {
        return typeof item;
    }
};
/**
 *
 * @param {*} item
 * @returns {boolean}
 */
const isOperation = (item) => {
    return Object.entries(item).some(([key]) => {
        return isOperator(key);
    });
};
/**
 *
 * @param {string} element
 * @returns {boolean}
 */
const isOperator = (element) => {
    if (Object.keys(common_1.OPERATORS.logical).includes(element) ||
        Object.keys(common_1.OPERATORS.comparison).includes(element) ||
        Object.keys(common_1.OPERATORS.aggregation).includes(element)) {
        return true;
    }
    return false;
};
/**
 *
 * @param {string} key
 * @returns {boolean}
 */
const isStatement = (key) => {
    return common_1.getOperatorType(key) === 'logical';
};
/**
 *
 * @param {Object} query
 * @param {string} [operand]
 * @returns {Array<Token>}
 */
const getTokens = (query, operand) => {
    const tokens = [];
    for (const [key, item] of Object.entries(query)) {
        const itemType = getItemType(item);
        const token = { type: '', operator: '' };
        if (isOperator(key)) {
            if (isStatement(key)) {
                token.type = 'statement';
                token.operator = key;
                token.children = [];
                if (itemType === 'array') {
                    for (const element of item) {
                        token.children.push(...getTokens(element));
                    }
                }
                else {
                    token.children.push(...getTokens(item, operand));
                }
            }
            else {
                token.type = 'expression';
                token.operand = operand;
                token.operator = key;
                token.value = item;
            }
            tokens.push(token);
        }
        else {
            if (isOperation(item)) {
                tokens.push(...getTokens(item, key));
            }
            else {
                token.type = 'expression';
                token.operator = '$eq';
                token.operand = key;
                token.value = item;
                tokens.push(token);
            }
        }
    }
    return tokens;
};
/**
 *
 * @param {Object} query
 * @returns {Array<Token>}
 */
const parse = (query) => {
    return getTokens(query);
};
exports.parse = parse;
//# sourceMappingURL=parser.js.map