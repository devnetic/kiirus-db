import packageInfo from './../../package'
import { stats } from './../engine'

const routes = [{
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

export default routes
