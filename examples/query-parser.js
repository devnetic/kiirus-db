const { builder, compiler, parser } = require('./../src/engine')

const { utils } = require('./../src/support')

// parser.parse({
//   $filter: { numbers: [1] }
// })
let query = {}
let parsed = []

// -----------------------------------------------------------------------------

// query = { qty: 50 }
// query = { qty: { $ne: 50 } }
// query = { size: { h: 14, w: 21, uom: 'cm' } }
// query = { qty: { $gt: 10, $lte: 20 } }
// query = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// query = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// query = {
//   $and: [
//     { $or: [{ price: 0.99 }, { price: 1.99 }] },
//     { $or: [{ sale: true }, { qty: { $lt: 20 } }] }
//   ]
// }
// query = { qty: { $in: [1, 2, 3] } }
// query = { status: { $nin: ['A', 'B'] } }
// query = { price: { $not: { $gt: 1.99 } } }
// query = { $nor: [{ price: 1.99 }, { sale: true }] }
// query = { status: 'A', qty: { $lt: 30 } }
// query = { numbers: { $filter: [1, 'A', 'B'] } }
query = { instock: { $filter: { warehouse: 'A', qty: 5 } } }
// query = { instock: { $filter: [{ warehouse: 'A', qty: 5 }] } }
// query = {
//   item: 'journal',
//   qty: { $lt: 50 },
//   status: { $eq: 'A' },
//   'size.h': { $lte: 8.5 },
//   $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
// }
// query = { instock: { warehouse: 'A', qty: 5 } }
// query = { test: { foo: 'bar' } }
// query = { $nor: [{ price: 1.99 }, { item: 'journal' }] }
// query = { roles: { $filter: [{ role: 'readAnyDatabase', db: 'admin' }, { role: 'read', db: 'test-database' }, { role: 'readWrite', db: 'test-database' } ] } }
// query = {
//   'size.uom': 'in',
//   status: 'P'
// }

const type = 'query'
const join = '; '
parsed = parser.parse(query)

// console.log(JSON.stringify(parsed, null, '  '))

const compiled = compiler.compile(parsed, type, join)
const builded = builder.build(compiled, type)

console.log(compiled)
// console.log(builded)

const data = [
  { item: 'journal', price: 1.99, instock: [{ warehouse: 'A', qty: 5 }, { warehouse: 'C', qty: 15 }] },
  { item: 'notebook', price: 2.99, instock: [{ warehouse: 'C', qty: 5 }] },
  { item: 'paper', price: 4.99, instock: [{ warehouse: 'A', qty: 60 }, { warehouse: 'B', qty: 15 }] },
  { item: 'planner', price: 1.99, instock: [{ warehouse: 'A', qty: 40 }, { warehouse: 'B', qty: 5 }] },
  { item: 'postcard', price: 5.99, instock: [{ warehouse: 'B', qty: 15 }, { warehouse: 'C', qty: 35 }] }
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
