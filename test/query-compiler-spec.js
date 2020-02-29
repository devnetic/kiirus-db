import test from 'ava'

const { parser } = require('./../src/engine')

test('QueryParser comparision operator: simple equal with operator', t => {
  const query = { qty: 50 }
  const compiledQuery = ['qty === 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple not equal', t => {
  const query = { qty: { $ne: 50 } }
  const compiledQuery = ['qty !== 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple less than', t => {
  const query = { qty: { $lt: 50 } }
  const compiledQuery = ['qty < 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple greater than', t => {
  const query = { qty: { $gt: 50 } }
  const compiledQuery = ['qty > 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple less than or equal', t => {
  const query = { qty: { $lte: 50 } }
  const compiledQuery = ['qty <= 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple greater than or equal', t => {
  const query = { qty: { $gte: 50 } }
  const compiledQuery = ['qty >= 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple in', t => {
  const query = { qty: { $in: [1, 2, 3] } }
  const compiledQuery = ['[1,2,3].includes(qty)']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser comparision operator: simple not in', t => {
  const query = { qty: { $nin: [1, 2, 3] } }
  const compiledQuery = ['![1,2,3].includes(qty)']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser logical operator: simple and', t => {
  const query = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = ['qty !== 25', 'status === \'A\'']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

test('QueryParser logical operator: simple or', t => {
  const query = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const compiledQuery = ['qty !== 25', 'status === \'A\'']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})

// test('QueryParser logical operator: simple nor', t => {
//   let query = { $nor: [{ price: 1.99 }, { sale: true }] }
//   let compiledQuery = ['qty !== 25', 'status === \'A\'']

//   let parsed = parser.parse(query)

//   t.deepEqual(compiledQuery, parser.compile(parsed))

//   query = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
//   compiledQuery = ['qty !== 25', 'status === \'A\'']

//   parsed = parser.parse(query)

//   t.deepEqual(compiledQuery, parser.compile(parsed))
// })

test('QueryParser logical operator: simple not', t => {
  const query = { price: { $not: { $gt: 1.99 } } }
  const compiledQuery = ['!(price > 1.99)']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})
