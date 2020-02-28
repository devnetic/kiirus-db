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
// query = { qty: { $lt: 50 } }
// query = { instock: { warehouse: 'A', qty: 5 } } // don't accept this syntat, $filter is more appropied
// query = { $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }] }
// query = {
//   $and: [
//     { $or: [{ price: 0.99 }, { price: 1.99 }] },
//     { $or: [{ sale: true }, { qty: { $lt: 20 } }] }
//   ]
// }
// query = { status: { $in: ['A', 'D'] } }
// query = { qty: { $nin: [1, 2, 3] } }
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

parsed = parser.parse(query)

// console.log(JSON.stringify(parsed, null, '  '))

console.log(parser.build(parsed))

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
