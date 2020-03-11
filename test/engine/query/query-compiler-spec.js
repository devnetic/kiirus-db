import test from 'ava'

const { compiler, parser } = require('../../../src/engine')

const RECORD_NAME = 'record'

test('QueryParser comparision operator: simple equal without operator', t => {
  const query = { qty: 50 }
  const compiledQuery = `isEqual(${RECORD_NAME}.qty, 50)`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple equal with operator', t => {
  const query = { qty: { $eq: 50 } }
  const compiledQuery = `isEqual(${RECORD_NAME}.qty, 50)`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: complex equal with operator', t => {
  const query = { size: { h: 14, w: 21, uom: 'cm' } }
  const compiledQuery = `isEqual(${RECORD_NAME}.size, {"h":14,"w":21,"uom":"cm"})`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: multiple operators', t => {
  const query = { qty: { $gt: 10, $lte: 20 } }
  const compiledQuery = `${RECORD_NAME}.qty > 10 && ${RECORD_NAME}.qty <= 20`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple not equal', t => {
  const query = { qty: { $ne: 50 } }
  const compiledQuery = `!isEqual(${RECORD_NAME}.qty, 50)`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple less than', t => {
  const query = { qty: { $lt: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty < 50`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple greater than', t => {
  const query = { qty: { $gt: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty > 50`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple less than or equal', t => {
  const query = { qty: { $lte: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty <= 50`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple greater than or equal', t => {
  const query = { qty: { $gte: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty >= 50`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple in', t => {
  let query = { qty: { $in: [1, 2, 3] } }
  let compiledQuery = `[1,2,3].includes(${RECORD_NAME}.qty)`

  let parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))

  query = { qty: { $in: ['A', 'B', 'C'] } }
  compiledQuery = `['A','B','C'].includes(${RECORD_NAME}.qty)`

  parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple not in', t => {
  let query = { qty: { $nin: [1, 2, 3] } }
  let compiledQuery = `![1,2,3].includes(${RECORD_NAME}.qty)`

  let parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))

  query = { qty: { $nin: ['A', 'B', 'C'] } }
  compiledQuery = `!['A','B','C'].includes(${RECORD_NAME}.qty)`

  parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple and', t => {
  const query = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = `(!isEqual(${RECORD_NAME}.qty, 25) && isEqual(${RECORD_NAME}.status, 'A'))`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple or', t => {
  const query = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = `(!isEqual(${RECORD_NAME}.qty, 25) || isEqual(${RECORD_NAME}.status, 'A'))`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple nor', t => {
  let query = { $nor: [{ price: 1.99 }, { sale: true }] }
  let compiledQuery = `(!(isEqual(${RECORD_NAME}.price, 1.99) || isEqual(${RECORD_NAME}.sale, true)))`

  let parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))

  query = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
  compiledQuery = `(!(isEqual(${RECORD_NAME}.price, 1.99) || ${RECORD_NAME}.qty < 20 || isEqual(${RECORD_NAME}.sale, true)))`

  parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple not', t => {
  const query = { price: { $not: { $gt: 1.99 } } }
  const compiledQuery = '(!(record.price > 1.99))'

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: complex query', t => {
  const query = {
    item: 'journal',
    qty: { $lt: 50 },
    status: { $eq: 'A' },
    'size.h': { $lte: 8.5 },
    $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
  }
  const compiledQuery = 'isEqual(record.item, \'journal\') && record.qty < 50 && ' +
    'isEqual(record.status, \'A\') && record.size.h <= 8.5 && ' +
    '(isEqual(record.size.w, 14) || record.size.h >= 8.5)'

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser aggregation operator: filter with array value', t => {
  const query = {
    numbers: { $filter: [1, 2, 3] }
  }
  const compiledQuery = 'record.numbers.filter(item => [1,2,3].some(element => isEqual(element, item)))'

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser aggregation operator: filter with object value', t => {
  const query = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
  const compiledQuery = 'record.instock.filter(item => isEqual(item, {"warehouse":"A","qty":5}))'

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})
