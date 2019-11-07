const { Client } = require('./../../../src')

const host = 'http://localhost'
const port = 8008
const database = 'test-database'
const collection = 'tasks'

const client = Client.connect(`${host}:${port}`)

client
  .db(database)
  .collection(collection)
  .delete({
    'size.uom': 'in'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
