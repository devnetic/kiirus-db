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

const port = Number(process.env.PORT ?? 8008)
const host = process.env.HOSTNAME ?? '::'

app.listen({ port, host }, (error, address): void => {
  if (error !== null) {
    logger(`Something bad happened: ${error.message}`, 'error')
  }

  startEngine().then(() => {
    stats.setStartTime()

    logger(`Server is listening on ${address}`, 'info')
  }).catch((error: any) => {
    logger(error.message, 'error')
  })
})
