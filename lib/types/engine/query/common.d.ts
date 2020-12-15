export declare const RECORD_NAME: string;
export interface ComparisonOperators {
    $eq: string;
    $gt: string;
    $gte: string;
    $in: string;
    $lt: string;
    $lte: string;
    $ne: string;
    $nin: string;
}
export interface ComplexOperator {
    name: string;
    template: string;
    join: string;
}
export interface LogicalOperators {
    $and: string;
    $nor: ComplexOperator;
    $not: ComplexOperator;
    $or: string;
}
export interface AggregationOperators {
    $filter: string;
    $pull: string;
    $push: string;
}
export interface Operators {
    comparison: ComparisonOperators;
    logical: LogicalOperators;
    aggregation: AggregationOperators;
    array: Array<'$filter' | '$in' | '$nin'>;
}
export declare const OPERATORS: Operators;
/**
 *
 * @param {string} operator
 * @returns {string}
 */
export declare const getOperatorType: (operator: string) => string;
