import { getErrorMessage } from './../../support';

export const RECORD_NAME = 'record';

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

export const OPERATORS: Operators = {
  comparison: {
    $eq: '===',
    $gt: '>',
    $gte: '>=',
    $in: '$in',
    $lt: '<',
    $lte: '<=',
    $ne: '!==',
    $nin: '$nin',
  },
  logical: {
    $and: '&&',
    $nor: { name: '$nor', template: '!(BODY)', join: '||' },
    $not: { name: '$not', template: '!(BODY)', join: '&&' },
    $or: '||',
  },
  aggregation: {
    $filter: 'filter',
    $pull: 'filter',
    $push: 'push',
  },
  array: ['$filter', '$in', '$nin'],
};

/**
 *
 * @param {string} operator
 * @returns {string}
 */
export const getOperatorType = (operator: string): string => {
  if (Object.keys(OPERATORS.logical).includes(operator)) {
    return 'logical';
  } else if (Object.keys(OPERATORS.comparison).includes(operator)) {
    return 'comparison';
  } else if (Object.keys(OPERATORS.aggregation).includes(operator)) {
    return 'aggregation';
  }

  throw new Error(getErrorMessage('KDB0010'));
};
