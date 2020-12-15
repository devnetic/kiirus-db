"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const support_1 = require("../../support");
const common_1 = require("./common");
/**
 *
 * @param {Array<Token>} syntaxTree
 * @param {string} [type='query|aggregation']
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree = [], commandType = 'query', join = '&&') => {
    const compiled = [];
    for (const token of syntaxTree) {
        if (token.type === 'statement') {
            compiled.push(`(${exports.compile(token.children, commandType, getOperator(token.operator))})`);
        }
        else {
            const expression = compileExpression(token, commandType);
            if (expression) {
                compiled.push(expression);
            }
        }
    }
    if (getType(join) === 'object') {
        return join.template.replace('BODY', compiled.join(` ${join.join} `));
    }
    return compiled.join(`${formatJoin(join)}`);
};
exports.compile = compile;
const compileEqual = (operand, value, valueType, commandType) => {
    if (commandType === 'query') {
        return `getType(${common_1.RECORD_NAME}.${operand}) === 'array' ? ${compileFind(operand, value, valueType)} : isEqual(${common_1.RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`;
    }
    return `${common_1.RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`;
};
const compileNotEqual = (operand, value, valueType) => {
    return `!${compileEqual(operand, value, valueType)}`;
};
const compileExpression = (token, commandType = 'query') => {
    const { operand = '', operator, value } = token;
    const valueType = getType(value);
    switch (valueType) {
        case 'boolean':
        case 'number':
        case 'string':
            return `${common_1.RECORD_NAME}.${operand} ${getOperator(operator, commandType)} ${compileValue(value, valueType)}`;
        case 'array':
        case 'object':
            switch (operator) {
                case '$eq':
                    return compileEqual(operand, value, valueType, commandType);
                case '$filter':
                    return compileFilter(operand, value, valueType);
                case '$in':
                    return compileIn(operand, value, valueType);
                case '$ne':
                    return compileNotEqual(operand, value, valueType);
                case '$nin':
                    return compileNotIn(operand, value, valueType);
                case '$pull':
                    return compilePull(operand, value, valueType);
                case '$push':
                    return compilePush(operand, value, valueType);
            }
    }
    throw new Error(support_1.getErrorMessage('KDB0012'));
};
const compileFilter = (operand, value, valueType) => {
    return `${common_1.RECORD_NAME}.${operand} = ${common_1.RECORD_NAME}.${operand}.filter(item => ${compileFilterValue(value, valueType)})`;
};
const compileFind = (operand, value, valueType) => {
    return `${common_1.RECORD_NAME}.${operand}.find(item => ${compileFilterValue(value, valueType)})`;
};
const compileFilterValue = (value, valueType) => {
    if (valueType === 'object') {
        return `isEqual(item, ${JSON.stringify(value)})`;
    }
    else {
        return `${JSON.stringify(value)}.some(element => isEqual(item, element))`;
    }
};
const compileIn = (operand, value, valueType) => {
    return `${compileValue(value, valueType)}.includes(${common_1.RECORD_NAME}.${operand})`;
};
const compileNotIn = (operand, value, valueType) => {
    return `!${compileIn(operand, value, valueType)}`;
};
const compilePull = (operand, value, valueType) => {
    return `${common_1.RECORD_NAME}.${operand} = ${common_1.RECORD_NAME}.${operand}.filter(item => !${compileFilterValue(value, valueType)})`;
};
const compilePush = (operand, value, valueType) => {
    return `${common_1.RECORD_NAME}.${operand}.push(${valueType === 'array' ? '...' : ''}${compileValue(value, valueType)})`;
};
const compileValue = (value, type) => {
    switch (type) {
        case 'array':
        case 'object':
            return JSON.stringify(value);
        case 'boolean':
        case 'number':
            return value;
        case 'string':
            return `'${value}'`;
    }
    throw new Error(support_1.getErrorMessage('KDB0013'));
};
const formatJoin = (join) => {
    return join === ';' ? `${join} ` : ` ${join} `;
};
/**
 * Get the language operator symbol for the given query symbol
 *
 * @param {string} [operator='$eq']
 * @param {string} [type='query|aggregation']
 * @returns {string}
 */
const getOperator = (operator = '$eq', commandType = 'query') => {
    var _a;
    if (commandType === 'aggregation') {
        return '=';
    }
    return (_a = Reflect.get(Reflect.get(common_1.OPERATORS, common_1.getOperatorType(operator)), operator)) !== null && _a !== void 0 ? _a : undefined;
};
/**
 * Return the operand type <array|logical|comparison|object|primitive>
 *
 * @param {*} value
 * @returns {string}
 */
const getType = (value) => {
    if (Array.isArray(value)) {
        return 'array';
    }
    else if (Object.keys(common_1.OPERATORS.logical).includes(value)) {
        return 'logical';
    }
    else if (Object.keys(common_1.OPERATORS.comparison).includes(value)) {
        return 'comparison';
    }
    else {
        return typeof value;
    }
};
//# sourceMappingURL=compiler.js.map