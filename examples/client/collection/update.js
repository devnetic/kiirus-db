const { Client } = require('./../../../src')

const host = 'http://localhost'
const port = 8008
const database = 'test-database'
const collection = 'tasks'

const client = Client.connect(`${host}:${port}`)

client
  .db(database)
  .collection(collection)
  .update({
    item: 'journal'
  }, {
    'size.uom': 'in',
    status: 'A'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })

client
  .db(database)
  .collection(collection)
  .update({
    item: 'journal'
  }, {
    'size.uom': 'in',
    status: 'B'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })

client
  .db(database)
  .collection(collection)
  .update({
    item: 'journal'
  }, {
    'size.uom': 'in',
    status: 'C'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
