import packageInfo from './../../package.json'
import { getUptime } from './../engine'

export const info = [{
  type: 'get',
  path: '/info',
  handler: (request, response) => {
    response.send({ uptime: getUptime() })
  }
}, {
  type: 'get',
  path: '/info/version',
  handler: (request, response) => {
    response.send({ version: packageInfo.version })
  }
}]
