import test from 'ava'

const { utils } = require('../../src/support')

test('simple values should pass', async (t) => {
  t.true(utils.isEqual(1, 1))
})

test('no type cohersion should be applied', async (t) => {
  t.false(utils.isEqual(1, '1'))
})

test('should not mess with null and undefined values', async (t) => {
  t.false(utils.isEqual(null, undefined))
  t.true(utils.isEqual(null, null))
  t.true(utils.isEqual(undefined, undefined))
})

test('should handle objects', async (t) => {
  const obj1 = { name: 'Joe', surname: 'Smith' }
  const obj2 = { name: 'Joe', surname: 'Smith' }

  t.true(utils.isEqual(obj1, obj2))
})

test('property order should not matter', async (t) => {
  const obj1 = { name: 'Joe', surname: 'Smith' }
  const obj2 = { surname: 'Smith', name: 'Joe' }

  t.true(utils.isEqual(obj1, obj2))
})

test('should detect when a property is missing', async (t) => {
  const obj1 = { name: 'Joe', surname: 'Smith' }
  const obj2 = { name: 'Joe' }

  t.false(utils.isEqual(obj1, obj2))
  t.false(utils.isEqual(obj2, obj1))
})

test('should compare arrays', async (t) => {
  const obj1 = [1, 2, null, undefined, { name: 'Joe' }]
  const obj2 = [1, 2, null, undefined]

  t.false(utils.isEqual(obj1, obj2))

  obj2.push({ name: 'Joe' })
  t.true(utils.isEqual(obj2, obj1))
})

test('order is important with arrays', async (t) => {
  const obj1 = [1, 2, 3]
  const obj2 = [1, 3, 2]

  t.false(utils.isEqual(obj1, obj2))
})

test('should handle nested objects and arrays', async (t) => {
  const obj1 = [
    { address: { number: '20', street: 'Lane' }, age: 20, name: 'Joe' },
    null,
    4,
    undefined,
    [
      { sub: 1, array: [1, 2, 3], active: true },
      { sub: 2, array: [2, 4, 6], active: false }
    ]
  ]
  const obj2 = [
    { age: 20, name: 'Joe', address: { street: 'Lane', number: '20' } },
    null,
    4,
    undefined,
    [
      { array: [1, 2, 3], active: true, sub: 1 },
      { active: false, sub: 2, array: [2, 4, 6] }
    ]
  ]

  t.true(utils.isEqual(obj1, obj2))
})

test('should handle primitives like objects', async (t) => {
  t.true(utils.isEqual(1, Number(1)))
  t.true(utils.isEqual('a', String('a')))
  t.true(utils.isEqual(true, Boolean(true)))
})

test('should handle same object comparison', async (t) => {
  const obj = { here: { is: 'an' }, object: 2, and: { an: { array: [1, 2] } } }

  t.true(utils.isEqual(obj, obj))
})
