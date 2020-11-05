import path from 'path'

import * as loadEnv from '@devnetic/load-env'
// import * as server from '@devnetic/server'
import fastify from 'fastify'

import * as routes from './routes'
import * as stats from './engine/stats'

loadEnv.load()
loadEnv.load(path.join(__dirname, './../config/.error_description'))

const app = fastify()

for (const [, routesDefinition] of Object.entries(routes)) {
  for (const route of routesDefinition) {
    app[route.type](route.path, route.handler)
  }
}

app.listen(process.env.PORT, process.env.HOSTNAME, (error) => {
  if (error) {
    console.error('Something bad happened: %o', error)

    throw new Error(`Something bad happened ${error}`)
  }

  stats.setStartTime()

  const { address: hostname, port } = app.server.address()

  console.log(`Server is listening on host ${hostname} and port ${port}`)
})
