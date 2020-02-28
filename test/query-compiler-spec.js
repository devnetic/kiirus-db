import test from 'ava'

const { parser } = require('./../src/engine')

test('QueryParser comparision operator: simple equal with operator', t => {
  const query = { qty: 50 }
  const compiledQuery = ['qty === 50']

  const parsed = parser.parse(query)

  t.deepEqual(compiledQuery, parser.compile(parsed))
})
