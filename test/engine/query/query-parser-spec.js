import test from 'ava'

import { query } from '../../../src/engine'

test('QueryParser comparison operator: simple equal without operator', t => {
  const testQuery = { qty: 50 }
  const syntaxTree = [{
    type: 'expression',
    operator: '$eq',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple equal with operator', t => {
  const testQuery = { qty: { $eq: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$eq',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: complex equal with operator', t => {
  const testQuery = { size: { h: 14, w: 21, uom: 'cm' } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$eq',
    operand: 'size',
    value: { h: 14, w: 21, uom: 'cm' }
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: multiple operators', t => {
  const testQuery = { qty: { $gt: 10, $lte: 20 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$gt',
    operand: 'qty',
    value: 10
  }, {
    type: 'expression',
    operator: '$lte',
    operand: 'qty',
    value: 20
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple not equal', t => {
  const testQuery = { qty: { $ne: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$ne',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple less than', t => {
  const testQuery = { qty: { $lt: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$lt',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple greater than', t => {
  const testQuery = { qty: { $gt: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$gt',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple less than or equal', t => {
  const testQuery = { qty: { $lte: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$lte',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple greater than or equal', t => {
  const testQuery = { qty: { $gte: 50 } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$gte',
    operand: 'qty',
    value: 50
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple in', t => {
  const testQuery = { qty: { $in: [1, 2, 3] } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$in',
    operand: 'qty',
    value: [1, 2, 3]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser comparison operator: simple not in', t => {
  const testQuery = { qty: { $nin: [1, 2, 3] } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$nin',
    operand: 'qty',
    value: [1, 2, 3]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser logical operator: simple and', t => {
  const testQuery = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const syntaxTree = [{
    type: 'statement',
    operator: '$and',
    children: [{
      type: 'expression',
      operator: '$ne',
      operand: 'qty',
      value: 25
    }, {
      type: 'expression',
      operator: '$eq',
      operand: 'status',
      value: 'A'
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser logical operator: simple or', t => {
  const testQuery = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const syntaxTree = [{
    type: 'statement',
    operator: '$or',
    children: [{
      type: 'expression',
      operator: '$ne',
      operand: 'qty',
      value: 25
    }, {
      type: 'expression',
      operator: '$eq',
      operand: 'status',
      value: 'A'
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser logical operator: simple nor', t => {
  let testQuery = { $nor: [{ price: 1.99 }, { sale: true }] }
  let syntaxTree = [{
    type: 'statement',
    operator: '$nor',
    children: [{
      type: 'expression',
      operator: '$eq',
      operand: 'price',
      value: 1.99
    }, {
      type: 'expression',
      operator: '$eq',
      operand: 'sale',
      value: true
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))

  testQuery = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
  syntaxTree = [{
    type: 'statement',
    operator: '$nor',
    children: [{
      type: 'expression',
      operator: '$eq',
      operand: 'price',
      value: 1.99
    }, {
      type: 'expression',
      operator: '$lt',
      operand: 'qty',
      value: 20
    }, {
      type: 'expression',
      operator: '$eq',
      operand: 'sale',
      value: true
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser logical operator: simple not', t => {
  const testQuery = { price: { $not: { $gt: 1.99 } } }
  const syntaxTree = [{
    type: 'statement',
    operator: '$not',
    children: [{
      type: 'expression',
      operator: '$gt',
      operand: 'price',
      value: 1.99
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser logical operator: complex query', t => {
  const testQuery = {
    item: 'journal',
    qty: { $lt: 50 },
    status: { $eq: 'A' },
    'size.h': { $lte: 8.5 },
    $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
  }
  const syntaxTree = [{
    type: 'expression',
    operator: '$eq',
    operand: 'item',
    value: 'journal'
  }, {
    type: 'expression',
    operator: '$lt',
    operand: 'qty',
    value: 50
  }, {
    type: 'expression',
    operator: '$eq',
    operand: 'status',
    value: 'A'
  }, {
    type: 'expression',
    operator: '$lte',
    operand: 'size.h',
    value: 8.5
  }, {
    type: 'statement',
    operator: '$or',
    children: [{
      type: 'expression',
      operator: '$eq',
      operand: 'size.w',
      value: 14
    }, {
      type: 'expression',
      operator: '$gte',
      operand: 'size.h',
      value: 8.5
    }]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser aggregation operator: filter with array value', t => {
  const testQuery = {
    numbers: { $filter: [1, 2, 3] }
  }
  const syntaxTree = [{
    type: 'expression',
    operator: '$filter',
    operand: 'numbers',
    value: [1, 2, 3]
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})

test('QueryParser aggregation operator: filter with object value', t => {
  const testQuery = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
  const syntaxTree = [{
    type: 'expression',
    operator: '$filter',
    operand: 'instock',
    value: { warehouse: 'A', qty: 5 }
  }]

  t.deepEqual(syntaxTree, query.parse(testQuery))
})
