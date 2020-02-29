const { parser } = require('./../src/engine')

// parser.parse({
//   $filter: { numbers: [1] }
// })

let query = {}
let parsed = []

// query = { qty: 50 }

// parsed = parser.parse(query)

// console.log(JSON.stringify(parsed, null, '  '))

// -----------------------------------------------------------------------------

// query = { qty: 50 }
// query = { qty: { $ne: 50 } }
// query = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// query = { $or: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// query = {
//   $and: [
//     { $or: [{ price: 0.99 }, { price: 1.99 }] },
//     { $or: [{ sale: true }, { qty: { $lt: 20 } }] }
//   ]
// }
// query = { status: { $in: ['A', 'B'] } }
query = { status: { $nin: ['A', 'B'] } }
// query = { price: { $not: { $gt: 1.99 } } }
// query = { status: 'A', qty: { $lt: 30 } }
// query = { $filter: { numbers: [1] } }
// query = {
//   item: 'journal',
//   qty: { $lt: 50 },
//   status: { $eq: 'A' },
//   'size.h': { $lte: 8.5 },
//   $or: [{ 'size.w': 14 }, { 'size.h': { $gte: 8.5 } }]
// }
// query = { instock: { warehouse: 'A', qty: 5 } } // don't accept this syntat, $filter is more appropied

parsed = parser.parse(query)

// console.log(JSON.stringify(parsed, null, '  '))

const compiled = parser.compile(parsed)
const builded = parser.build(compiled)

console.log(compiled)
// console.log(builded)

const data = [
  { item: 'journal', price: 1.99, qty: 25, status: 'A', size: { h: 14, w: 21, uom: 'cm' }, tags: ['blank', 'red'] },
  { item: 'notebook', price: 2.99, qty: 50, status: 'A', size: { h: 8.5, w: 11, uom: 'in' }, tags: ['red', 'blank'] },
  { item: 'paper', price: 1.99, qty: 10, status: 'D', size: { h: 8.5, w: 11, uom: 'in' }, tags: ['red', 'blank', 'plain'] },
  { item: 'planner', price: 3.99, qty: 0, status: 'D', size: { h: 22.85, w: 30, uom: 'cm' }, tags: ['blank', 'red'] },
  { item: 'postcard', price: 4.99, qty: 45, status: 'A', size: { h: 10, w: 15.25, uom: 'cm' }, tags: ['blue'] }
]

console.log(data.filter(builded))

// [
//   {
//     "type": "expression",
//     "operator": "$filter",
//     "operand": "numbers",
//     "value": [
//       1
//     ]
//   }
// ]
