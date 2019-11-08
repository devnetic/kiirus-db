#!/usr/bin/env node
const path = require('path')

const server = require('@devnetic/server')

const { routes } = require('./src/')
const { loadEnv } = require('./src/support')

loadEnv.load()

process.env.DB_PATH = path.join(__dirname, process.env.DB_PATH)

const port = process.env.SERVER_PORT || 8008
const host = process.env.SERVER_HOST || '::'

for (const [, routesDefinition] of Object.entries(routes)) {
  for (const route of routesDefinition) {
    server.router[route.type](route.path, route.handler)
  }
}

server.listen(port, host)
