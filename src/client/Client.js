import fetch from '@devnetic/fetch'

import { utils } from './../support'

/**
 * @typedef {Object} Command
 * @property {string} command The commanf name
 * @property {Object} [options] Options for the command; this attribute is optional
 */

export default class Client {
  constructor (url) {
    this.command = {
      current: 'database',
      collection: null,
      database: null,
      payload: null
    }

    this.url = url
    // this.init()

    return new Proxy(this, {
      get (target, property, receiver) {
        if (Reflect.has(target, property)) {
          return Reflect.get(target, property)
        } else {
          return (data, ...extra) => {
            const params = extra.length > 0 ? [data, ...extra] : data

            target.command.payload = target.createCommand(target.command.current, property, params)

            return target.send(target.command.payload)
          }
        }
      },
      getPrototypeOf (target) {
        return Object.getPrototypeOf(target)
      }
    })
  }

  static connect (url) {
    return new Client(url)
  }

  /**
   *
   * @param {string} name
   * @returns {Client}
   */
  collection (name) {
    this.command.collection = name

    this.command.current = 'collection'

    return this
  }

  /**
   * Create a command in the proper formar to be sended to the server
   *
   * @param {string} type
   * @param {string} name
   * @param {Object} data
   * @returns {Command}
   */
  createCommand (type, name, data) {
    const options = {}

    if (this.command.database) {
      options.database = this.command.database
    }

    if (this.command.collection) {
      options.collection = this.command.collection
    }

    if (data) {
      options.body = data
    }

    return { command: `${type.toLowerCase()}-${utils.kebabCase(name)}`, options }
  }

  db (name) {
    this.command.database = name

    this.command.current = 'database'

    return this
  }

  init () {
    this.command = {
      current: 'database',
      collection: null,
      database: null,
      payload: null
    }
  }

  /**
   * Send a command to the server
   *
   * @param {Object} data
   * @param {string} [contentType]
   */
  async send (data, contentType = 'application/json') {
    const body = JSON.stringify(data)

    const options = {
      method: 'POST',
      body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(body)
      }
    }

    // Before send any command, the client state is reset
    this.init()

    const response = await fetch(this.url, options)

    return response.json()
  }
}
