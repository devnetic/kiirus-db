// #!/usr/bin/env node

import path from 'path'

import server from '@devnetic/server'

import { loadEnv, getErrorMessage } from './src/support'

import { startEngine, stats } from './src/engine'
import { routes } from './src/'

/**
 * General start function
 */
const start = async () => {
  loadEnv.load()
  loadEnv.load('.errors_description')

  if (!process.env.DB_PATH) {
    console.log(getErrorMessage('KDB0001'))

    process.exit()
  }

  process.env.DB_PATH = path.join(__dirname, process.env.DB_PATH)

  const isInitiated = await startEngine()

  if (!isInitiated) {
    console.log(getErrorMessage('KDB0008'))

    return
  }

  const port = process.env.SERVER_PORT || 8008
  const host = process.env.SERVER_HOST || '::'

  for (const [, routesDefinition] of Object.entries(routes)) {
    for (const route of routesDefinition) {
      server.router[route.type](route.path, route.handler)
    }
  }

  stats.setStartTime()

  server.listen(port, host)
}

start()
