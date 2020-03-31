const RECORD_NAME = 'record'

const OPERATORS = {
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
    // $not: { name: '$not', template: '!(OPERAND BODY)', join: '&&' },
    $not: { name: '$not', template: '!(BODY)', join: '&&' },
    $or: '||'
  },
  aggregation: {
    $filter: 'filter',
    $pull: 'filter',
    $push: 'push'
  },
  array: ['$filter', '$in', '$nin']
}

/**
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperatorType = (operator) => {
  if (Object.keys(OPERATORS.logical).includes(operator)) {
    return 'logical'
  } else if (Object.keys(OPERATORS.comparison).includes(operator)) {
    return 'comparison'
  } else if (Object.keys(OPERATORS.aggregation).includes(operator)) {
    return 'aggregation'
  }
}

export {
  OPERATORS,
  RECORD_NAME,
  getOperatorType
}
