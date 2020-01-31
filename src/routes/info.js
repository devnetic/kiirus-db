const packageInfo = require('./../../package')
const { stats } = require('./../engine')

module.exports = [{
  type: 'get',
  path: '/info',
  handler: (request, response) => {
    response.json({ uptime: stats.getUptime() })
  }
}, {
  type: 'get',
  path: '/info/version',
  handler: (request, response) => {
    response.json({ version: packageInfo.version })
  }
}]
