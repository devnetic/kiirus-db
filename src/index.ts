import { AddressInfo } from 'net'

import fastify from 'fastify'
import * as loadEnv from '@devnetic/load-env'

import * as routes from './routes'
import * as stats from './support/stats'
import { logger } from './support'
import { startEngine } from './engine'

loadEnv.load()
loadEnv.load('.errors_description')

const app = fastify()

for (const [, module] of Object.entries(routes)) {
  for (const route of module) {
    app.route(route)
  }
}

const port: string = process.env.PORT ?? '8008'
const hostname = process.env.HOSTNAME ?? '::'

app.listen(port, hostname, async (error): Promise<void> => {
  if (error !== null) {
    logger(`Something bad happened: ${error.message}`, 'error')
  }

  try {
    await startEngine()
  } catch (error) {
    logger(error.message, 'error')
  }

  stats.setStartTime()

  const { address: hostname, port } = app.server.address() as AddressInfo

  logger(`Server is listening on host ${hostname} and port ${port}`, 'info')
})
