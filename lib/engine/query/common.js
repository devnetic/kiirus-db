"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOperatorType = exports.OPERATORS = exports.RECORD_NAME = void 0;
exports.RECORD_NAME = 'record';
exports.OPERATORS = {
    comparison: {
        $eq: '===',
        $gt: '>',
        $gte: '>=',
        $in: '$in',
        $lt: '<',
        $lte: '<=',
        $ne: '!==',
        $nin: '$nin'
    },
    logical: {
        $and: '&&',
        $nor: { name: '$nor', template: '!(BODY)', join: '||' },
        $not: { name: '$not', template: '!(BODY)', join: '&&' },
        $or: '||'
    },
    aggregation: {
        $filter: 'filter',
        $pull: 'filter',
        $push: 'push'
    },
    array: ['$filter', '$in', '$nin']
};
/**
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperatorType = (operator) => {
    if (Object.keys(exports.OPERATORS.logical).includes(operator)) {
        return 'logical';
    }
    else if (Object.keys(exports.OPERATORS.comparison).includes(operator)) {
        return 'comparison';
    }
    else if (Object.keys(exports.OPERATORS.aggregation).includes(operator)) {
        return 'aggregation';
    }
    throw new Error(process.env['KDB0011']);
};
exports.getOperatorType = getOperatorType;
//# sourceMappingURL=common.js.map