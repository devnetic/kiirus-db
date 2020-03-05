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
    $filter: 'filter'
  },
  array: ['$filter', '$in', '$nin']
}

module.exports = {
  OPERATORS,
  RECORD_NAME
}
