import test from 'ava'

import { query } from '../../../src/engine'

const RECORD_NAME = 'record'

test('comparison operator: simple equal without operator', t => {
  const testQuery = { qty: 50 }
  const compiledQuery = `${RECORD_NAME}.qty === 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple equal with operator', t => {
  const testQuery = { qty: { $eq: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty === 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: complex equal with operator', t => {
  const testQuery = { size: { h: 14, w: 21, uom: 'cm' } }
  const compiledQuery = 'getType(record.size) === \'array\' ? record.size.find(item => isEqual(item, {"h":14,"w":21,"uom":"cm"})) : isEqual(record.size, {"h":14,"w":21,"uom":"cm"})'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: multiple operators', t => {
  const testQuery = { qty: { $gt: 10, $lte: 20 } }
  const compiledQuery = `${RECORD_NAME}.qty > 10 && ${RECORD_NAME}.qty <= 20`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple not equal', t => {
  const testQuery = { qty: { $ne: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty !== 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple less than', t => {
  const testQuery = { qty: { $lt: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty < 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple greater than', t => {
  const testQuery = { qty: { $gt: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty > 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple less than or equal', t => {
  const testQuery = { qty: { $lte: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty <= 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple greater than or equal', t => {
  const testQuery = { qty: { $gte: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty >= 50`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple in', t => {
  let testQuery = { qty: { $in: [1, 2, 3] } }
  let compiledQuery = `[1,2,3].includes(${RECORD_NAME}.qty)`

  let parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))

  testQuery = { qty: { $in: ['A', 'B', 'C'] } }
  compiledQuery = `['A','B','C'].includes(${RECORD_NAME}.qty)`

  parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('comparison operator: simple not in', t => {
  let testQuery = { qty: { $nin: [1, 2, 3] } }
  let compiledQuery = `![1,2,3].includes(${RECORD_NAME}.qty)`

  let parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))

  testQuery = { qty: { $nin: ['A', 'B', 'C'] } }
  compiledQuery = `!['A','B','C'].includes(${RECORD_NAME}.qty)`

  parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('logical operator: simple and', t => {
  const testQuery = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = `(${RECORD_NAME}.qty !== 25 && ${RECORD_NAME}.status === 'A')`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('logical operator: simple or', t => {
  const testQuery = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = `(${RECORD_NAME}.qty !== 25 || ${RECORD_NAME}.status === 'A')`

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('logical operator: simple nor', t => {
  let testQuery = { $nor: [{ price: 1.99 }, { sale: true }] }
  let compiledQuery = `(!(${RECORD_NAME}.price === 1.99 || ${RECORD_NAME}.sale === true))`

  let parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))

  testQuery = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
  compiledQuery = `(!(${RECORD_NAME}.price === 1.99 || ${RECORD_NAME}.qty < 20 || ${RECORD_NAME}.sale === true))`

  parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('logical operator: simple not', t => {
  const testQuery = { price: { $not: { $gt: 1.99 } } }
  const compiledQuery = '(!(record.price > 1.99))'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('logical operator: complex query', t => {
  const testQuery = {
    item: 'journal',
    qty: { $lt: 50 },
    status: { $eq: 'A' },
    'size.h': { $lte: 8.5 },
    $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
  }
  const compiledQuery = 'record.item === \'journal\' && record.qty < 50 && ' +
    'record.status === \'A\' && record.size.h <= 8.5 && ' +
    '(record.size.w === 14 || record.size.h >= 8.5)'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('aggregation operator: $filter with scalar values', t => {
  const testQuery = {
    numbers: { $filter: [1, 2, 3, 'a'] }
  }
  const compiledQuery = 'record.numbers = record.numbers.filter(item => [1,2,3,\'a\'].some(element => isEqual(element, item)))'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('aggregation operator: $filter with object value', t => {
  const testQuery = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
  const compiledQuery = 'record.instock = record.instock.filter(item => isEqual(item, {"warehouse":"A","qty":5}))'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('aggregation operator: $filter with array value', t => {
  const testQuery = { instock: { $filter: [{ warehouse: 'A', qty: 5 }] } }
  const compiledQuery = 'record.instock = record.instock.filter(item => [{"warehouse":"A","qty":5}].some(element => isEqual(element, item)))'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed))
})

test('aggregation operator: set values', t => {
  const testQuery = { 'size.uom': 'in', status: 'P' }
  const compiledQuery = 'record.size.uom = \'in\'; record.status = \'P\''

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed, 'aggregation', ';'))
})

test('aggregation operator: $pull values', t => {
  const testQuery = { fruits: { $pull: ['apples', 'oranges'] } }
  const compiledQuery = 'record.fruits = record.fruits.filter(item => ![\'apples\',\'oranges\'].some(element => isEqual(element, item)))'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed, 'aggregation', ';'))
})

test('aggregation operator: $push values', t => {
  const testQuery = { fruits: { $push: ['apples', 'oranges'] } }
  const compiledQuery = 'record.fruits.push(...[\'apples\',\'oranges\'])'

  const parsed = query.parse(testQuery)

  t.is(compiledQuery, query.compile(parsed, 'aggregation', ';'))
})
