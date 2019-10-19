#!/usr/bin/env node
const path = require('path')

const server = require('@devnetic/server')

const { routes } = require('./src/')
const { config, storage } = require('./src/support')

config.load()

process.env.DB_PATH = path.join(__dirname, process.env.DB_PATH)

storage.createDir(process.env.DB_PATH).catch(error => {
  console.log(error)
}).finally(() => {
  const port = process.env.SERVER_PORT || 8008
  const host = process.env.SERVER_HOST || '::'

  for (const [, routesDefinition] of Object.entries(routes)) {
    for (const route of routesDefinition) {
      server.router[route.type](route.path, route.handler)
    }
  }

  server.listen(port, host)
})
