const { Client } = require('./../../../src')

const host = 'http://localhost'
const port = 8008
const database = 'test-database'
const collection = 'users'

const client = Client.connect(`${host}:${port}`)

client
  .db(database)
  .collection(collection)
  .find({
    $and: [{ qty: { $ne: 25 } }, { status: { $eq: 'A' } }]
  })
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })
