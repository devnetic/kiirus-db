import test from 'ava'

const { compiler, parser } = require('../../../src/engine')

const RECORD_NAME = 'record'

test('QueryParser comparision operator: simple equal with operator', t => {
  const query = { qty: 50 }
  const compiledQuery = `${RECORD_NAME}.qty === 50`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser comparision operator: simple not equal', t => {
  const query = { qty: { $ne: 50 } }
  const compiledQuery = `${RECORD_NAME}.qty !== 50`

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
  const compiledQuery = `(${RECORD_NAME}.qty !== 25 && ${RECORD_NAME}.status === 'A')`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple or', t => {
  const query = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = `(${RECORD_NAME}.qty !== 25 || ${RECORD_NAME}.status === 'A')`

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

test('QueryParser logical operator: simple nor', t => {
  let query = { $nor: [{ price: 1.99 }, { sale: true }] }
  let compiledQuery = `(!(${RECORD_NAME}.price === 1.99 || ${RECORD_NAME}.sale === true))`

  let parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))

  query = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
  compiledQuery = `(!(${RECORD_NAME}.price === 1.99 || ${RECORD_NAME}.qty < 20 || ${RECORD_NAME}.sale === true))`

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
  const compiledQuery = 'record.item === \'journal\' && record.qty < 50 && ' +
    'record.status === \'A\' && record.size.h <= 8.5 && ' +
    '(record.size.w === 14 || record.size.h >= 8.5)'

  const parsed = parser.parse(query)

  t.is(compiledQuery, compiler.compile(parsed))
})

// test('QueryParser aggregation operator: filter', t => {
//   const query = {
//     numbers: { $filter: [1, 2, 3] }
//   }
//   const compiledQuery = 'record.numbers.filter()'

//   const parsed = parser.parse(query)

//   t.is(compiledQuery, compiler.compile(parsed))
// })
