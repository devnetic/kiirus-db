const { Client } = require('../../../src/client')

const host = 'http://localhost'
const port = 8008

const client = Client.connect(`${host}:${port}`)

client
  .createUser({
    username: 'john-doe',
    password: 12345678,
    data: {
      employeeId: 12345
    },
    roles: [{
      role: 'readAnyDatabase',
      db: 'admin'
    }]
  })
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })
