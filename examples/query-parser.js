import { query } from './../src/engine'

const { utils } = require('./../src/support')

// parser.parse({
//   $filter: { numbers: [1] }
// })
let testQuery = {}
let parsed = []

// -----------------------------------------------------------------------------
// EXPRESSIONS QUERIES

// testQuery = { qty: 50 }
// testQuery = { qty: { $ne: 50 } }
testQuery = { size: { h: 14, w: 21, uom: 'cm' } }
// testQuery = { qty: { $gt: 10, $lte: 20 } }
// testQuery = { qty: { $in: [1, 2, 3] } }
// testQuery = { status: { $nin: ['A', 'B'] } }
// testQuery = { status: 'A', qty: { $lt: 30 } }
// testQuery = {
//   'size.uom': 'in',
//   status: 'P'
// }
// testQuery = { instock: { warehouse: 'A', qty: 5 } }
// -----------------------------------------------------------------------------

// STATEMENTS QUERIES

// testQuery = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// testQuery = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// testQuery = {
//   $and: [
//     { $or: [{ price: 0.99 }, { price: 1.99 }] },
//     { $or: [{ sale: true }, { qty: { $lt: 20 } }] }
//   ]
// }
// testQuery = { price: { $not: { $gt: 1.99 } } }
// testQuery = { $nor: [{ price: 1.99 }, { sale: true }] }
// testQuery = { $nor: [{ price: 1.99 }, { item: 'journal' }] }
// testQuery = {
//   item: 'journal',
//   qty: { $lt: 50 },
//   status: { $eq: 'A' },
//   'size.h': { $lte: 8.5 },
//   $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
// }

// -----------------------------------------------------------------------------

// AGGREGATION QUERIES

// testQuery = { numbers: { $filter: [1, 'A', 'B'] } }
// testQuery = { numbers: { $filter: [1, 2, 3, 'a'] } }
// testQuery = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
// testQuery = { instock: { $filter: [{ warehouse: 'A', qty: 5 }] } }
// testQuery = { roles: { $filter: [{ role: 'readAnyDatabase', db: 'admin' }, { role: 'read', db: 'test-database' }, { role: 'readWrite', db: 'test-database' } ] } }

// testQuery = { fruits: { $pull: ['apples', 'oranges'] } }
// testQuery = { fruits: { $push: ['passion fruit', 'watermelon'] } }
// testQuery = { fruits: { $push: { warehouse: 'A', qty: 5 } } }
// testQuery = {
//   name: 'read',
//   privileges: [
//     'find',
//     'listCollections',
//     'listIndexes'
//   ]
// }

// testQuery = {
//   username: 'john-doe',
//   password: 123456789,
//   customData: {
//     employeeId: 12345
//   },
//   roles: [
//     {
//       role: 'readAnyDatabase',
//       db: 'admin'
//     }
//   ]
// }

const type = 'aggregation'
const join = ';'
parsed = query.parse(testQuery)

// console.log(JSON.stringify(parsed, null, '  '))

const compiled = query.compile(parsed, type, join)
const builded = query.build(compiled, type)

console.log(compiled)
// console.log(builded)

// const data = [
//   { item: 'journal', price: 1.99, instock: [{ warehouse: 'A', qty: 5 }, { warehouse: 'C', qty: 15 }] },
//   { item: 'notebook', price: 2.99, instock: [{ warehouse: 'C', qty: 5 }] },
//   { item: 'paper', price: 4.99, instock: [{ warehouse: 'A', qty: 60 }, { warehouse: 'B', qty: 15 }] },
//   { item: 'planner', price: 1.99, instock: [{ warehouse: 'A', qty: 40 }, { warehouse: 'B', qty: 5 }] },
//   { item: 'postcard', price: 5.99, instock: [{ warehouse: 'B', qty: 15 }, { warehouse: 'C', qty: 35 }] }
// ]

const data = [
  { fruits: ['apples', 'pears', 'oranges', 'grapes', 'bananas'] }
]

// const data = [{
//   username: 'john-doe',
//   password: 12345678,
//   customData: {
//     employeeId: 12345
//   },
//   roles: [
//     {
//       role: 'readAnyDatabase',
//       db: 'admin'
//     }
//   ],
//   database: 'test-database',
//   _id: '5e33ad482466ece1a9970b34'
// }]

console.log(JSON.stringify(data.filter((param) => builded(param, utils.isEqual, utils.getType)), null, '  '))

// const result = data.filter(record => {
//   // return utils.getType(item.instock) === 'array' ? item.instock.find(item => utils.isEqual(item, { 'warehouse': 'A', 'qty': 5 })) : isEqual(item.instock, { 'warehouse': 'A', 'qty': 5 })
//   return record.roles.some(
//     item => [
//       { role: 'readAnyDatabase', db: 'admin' },
//       { 'role': 'read', 'db': 'test-database' },
//       { 'role': 'readWrite', 'db': 'test-database' }
//     ].some(element => utils.isEqual(element, item)))
// })

// console.log(JSON.stringify(result, null, '  '))

// console.log(data.map(record => {
//   // return builded(record)
//   record.roles = record.roles.filter(item => {
//     return ![{ 'role': 'readAnyDatabase', 'db': 'admin' }, { 'role': 'read', 'db': 'test-database' }, { 'role': 'readWrite', 'db': 'test-database' }].some(element => utils.isEqual(element, item))
//   })

//   return record
// }))

// [
//   {
//     'type': 'expression',
//     'operator': '$filter',
//     'operand': 'numbers',
//     'value': [
//       1
//     ]
//   }
// ]
