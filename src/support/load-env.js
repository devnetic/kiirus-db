import fs from 'fs'

/**
 * Load the .env file and set the ENV variables
 */
const load = (filename = '.env') => {
  try {
    const env = fs.readFileSync(`./${filename}`, 'utf8').trim().split('\n')
    let key
    let value

    env.forEach((config) => {
      [key, value] = config.split('=')

      process.env[key] = value
    })
  } catch (e) {
    console.log(e.message)
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

export {
  load,
  set
}
