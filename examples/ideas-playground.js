const { OPERATORS } = require('../src/engine/query/common')

const singleOperationItem = { $gt: 1.99 }
const multipleOperationItem = { $gt: 10, $lte: 20 }
const expression = { h: 14, w: 21, uom: 'cm' }

const isOperator = (element) => {
  if (Object.keys(OPERATORS.logical).includes(element) ||
    Object.keys(OPERATORS.comparison).includes(element) ||
    Object.keys(OPERATORS.aggregation).includes(element)
  ) {
    return true
  }

  return false
}

const isStatement = (item) => {
  return Object.entries(item).some(([key]) => {
    return isOperator(key)
  })
}

console.log(isStatement(singleOperationItem))
console.log(isStatement(multipleOperationItem))
console.log(isStatement(expression))
