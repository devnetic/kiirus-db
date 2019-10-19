const packageInfo = require('./../../package')

module.exports = [{
  type: 'get',
  path: '/info/version',
  handler: (request, response) => {
    response.json({ version: packageInfo.version })
  }
}]
