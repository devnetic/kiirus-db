const { Client } = require('./../../../src')

const host = 'http://localhost'
const port = 8008
const database = 'test-database'
const collection = 'tasks'

const client = Client.connect(`${host}:${port}`)

client
  .db(database)
  .collection(collection)
  .insert([
    { item: 'journal', price: 1.99, qty: 25, status: 'A', size: { h: 14, w: 21, uom: 'cm' }, tags: ['blank', 'red'] },
    { item: 'notebook', price: 2.99, qty: 50, status: 'A', size: { h: 8.5, w: 11, uom: 'in' }, tags: ['red', 'blank'] },
    { item: 'paper', price: 1.99, qty: 10, status: 'D', size: { h: 8.5, w: 11, uom: 'in' }, tags: ['red', 'blank', 'plain'] },
    { item: 'planner', price: 3.99, qty: 0, status: 'D', size: { h: 22.85, w: 30, uom: 'cm' }, tags: ['blank', 'red'] },
    { item: 'postcard', price: 4.99, qty: 45, status: 'A', size: { h: 10, w: 15.25, uom: 'cm' }, tags: ['blue'] }
  ]).then((result) => {
    console.log('result: %o', result)
  }).catch((error) => {
    console.log(error)
  })
