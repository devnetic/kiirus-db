const fs = require('fs')

/**
 * Load the .env file and set the ENV variables
 */
const load = () => {
  try {
    const env = fs.readFileSync('./.env', 'utf8').trim().split('\n')
    let key
    let value

    env.forEach((config) => {
      [key, value] = config.split('=')

      process.env[key] = value
    })
  } catch (e) {
  }
}

/**
 * Set a ENV variable value
 *
 * @param {string} key
 * @param {*} value
 */
const set = (key, value) => {
  process.env[key] = value
}

module.exports = {
  load,
  set
}
