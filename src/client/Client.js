const fetch = require('@devnetic/fetch')

/**
 * @typedef {Object} Command
 * @property {string} command The commanf name
 * @property {Object} [options] Options for the command; this attribute is optional
 */

class Client {
  constructor (url) {
    this.url = url
    this.init()

    return new Proxy(this, {
      get (target, property, receiver) {
        if (Reflect.has(target, property)) {
          return Reflect.get(target, property)
        } else {
          return (...data) => {
            const command = target.createCommand(target.command.current, property, data)

            return target.send(command)
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
    const options = {
      database: this.command.database
    }

    if (this.command.collection) {
      options.collection = this.command.collection
    }

    if (data) {
      options.data = data
    }

    return { command: `${type.toLowerCase()}-${name}`, options }
  }

  db (name) {
    this.command.database = name

    this.command.current = 'database'

    return this
  }

  init () {
    this.command = {
      current: null,
      collection: null,
      database: null
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

module.exports = Client
