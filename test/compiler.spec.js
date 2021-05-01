const test = require('ava')

const query = require('./../lib/engine/query')

test('parser comparison operator: simple equal without operator', t => {
  const testQuery = { qty: 50 }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty === 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple equal with operator', t => {
  const testQuery = { qty: { $eq: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty === 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: complex object equal with operator', t => {
  const testQuery = { size: { h: 14, w: 21, uom: 'cm' } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'isEqual(record.size, {"h":14,"w":21,"uom":"cm"})'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: complex array equal with operator', t => {
  const testQuery = { size: [{ h: 14, w: 21, uom: 'cm' }, { h: 15, w: 22, uom: 'cm' }] }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'isEqual(record.size, [{"h":14,"w":21,"uom":"cm"},{"h":15,"w":22,"uom":"cm"}])'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: multiple operators', t => {
  const testQuery = { qty: { $gt: 10, $lte: 20 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty > 10 && record.qty <= 20'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple not equal', t => {
  const testQuery = { qty: { $ne: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty !== 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple less than', t => {
  const testQuery = { qty: { $lt: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty < 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple greater than', t => {
  const testQuery = { qty: { $gt: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty > 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple less than or equal', t => {
  const testQuery = { qty: { $lte: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty <= 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple greater than or equal', t => {
  const testQuery = { qty: { $gte: 50 } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.qty >= 50'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple in', t => {
  const testQuery = { qty: { $in: [1, 2, 3] } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = '[].concat(record.qty).filter(item => [1,2,3].some(element => isEqual(item, element))).length > 0'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser comparison operator: simple not in', t => {
  const testQuery = { qty: { $nin: [1, 2, 3] } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = '![].concat(record.qty).filter(item => [1,2,3].some(element => isEqual(item, element))).length > 0'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser logical operator: simple and', t => {
  const testQuery = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = '(record.qty !== 25 && record.status === "A")'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser logical operator: simple or', t => {
  const testQuery = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = '(record.qty !== 25 || record.status === "A")'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser logical operator: simple nor', t => {
  let testQuery = { $nor: [{ price: 1.99 }, { sale: true }] }
  let parsedQuery = query.parse(testQuery)
  let compiledQuery = '(!(record.price === 1.99 || record.sale === true))'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))

  testQuery = { $nor: [{ price: 1.99 }, { qty: { $lt: 20 } }, { sale: true }] }
  parsedQuery = query.parse(testQuery)
  compiledQuery = '(!(record.price === 1.99 || record.qty < 20 || record.sale === true))'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser logical operator: simple not', t => {
  const testQuery = { price: { $not: { $gt: 1.99 } } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = '(!(record.price > 1.99))'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser logical operator: complex query', t => {
  const testQuery = {
    item: 'journal',
    qty: { $lt: 50 },
    status: { $eq: 'A' },
    'size.h': { $lte: 8.5 },
    $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
  }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.item === "journal" && record.qty < 50 && record.status === "A" && record.size.h <= 8.5 && (record.size.w === 14 || record.size.h >= 8.5)'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser aggregation operator: filter with single value', t => {
  const testQuery = {
    privileges: { $filter: { collection: { $eq: 'roles' } } }
  }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.privileges.filter(record => (record.collection === "roles")).length > 0'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser aggregation operator: filter with object value', t => {
  const testQuery = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.instock.filter(record => (record.warehouse === "A" && record.qty === 5)).length > 0'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})

test('parser aggregation operator: complex filter with object value', t => {
  const testQuery = { specification: { $filter: { $and: [{ frameBuffer: { $eq: '6 GB GDDR6' } }, { ram: '32 GB' }] } } }
  const parsedQuery = query.parse(testQuery)
  const compiledQuery = 'record.specification.filter(record => ((record.frameBuffer === "6 GB GDDR6" && record.ram === "32 GB"))).length > 0'

  t.deepEqual(compiledQuery, query.compile(parsedQuery))
})
