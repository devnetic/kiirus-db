#!/usr/bin/env node
const path = require('path')

const server = require('@devnetic/server')

const { init, stats } = require('./src/engine')
const { routes } = require('./src/')
const { loadEnv, getErrorMessage } = require('./src/support')

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

  const isInitiated = await init()

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
