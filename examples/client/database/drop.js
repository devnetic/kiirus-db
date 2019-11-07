const { Client } = require('../../../src/client')

const host = 'http://localhost'
const port = 8008
const database = 'test-database'

const client = Client.connect(`${host}:${port}`)

client
  .db(database)
  .drop()
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })
