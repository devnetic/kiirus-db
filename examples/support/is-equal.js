const { utils } = require('./../../src/support')

const a = { name: 'Joe', favorites: [1, 2, '3'], details: { key: 'value' } }
const b = { name: 'Joe', favorites: [1, 2, 3], details: { key: 'value' } }

console.log(utils.isEqual(a, b))
