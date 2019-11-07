/**
 * Transforms a value to camel case
 *
 * @param {string} value
 */
const camelCase = (value) => {
  return value.toLowerCase().trim().split(/[.\-_\s]/g).reduce(
    (string, word) => string + word[0].toUpperCase() + word.slice(1)
  )
}

/**
 * Perform a global regular expression match. Searches subject for all
 * matches to the regular expression given in pattern and return them.
 *
 * @param {Object} regex
 * @param {*} value
 * @returns {Array}
 */
const matchAll = (regex, value) => {
  let match
  const matches = []

  while ((match = regex.exec(value)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    matches.push(match)
  }

  return matches
}

/**
 * Set an array item to a given value using "dot" notation.
 *
 * If no path is given to the method, the entire array will be replaced.
 *
 * @param  {array}   array
 * @param  {string}  key
 * @param  {*}   value
 * @return {array}
 */
const setValue = (object, path, value) => {
  if (path === undefined) {
    object = value

    return object
  }

  const keys = path.split('.')

  while (keys.length > 1) {
    path = keys.shift()

    // If the key doesn't exist at this depth, we will just create an empty array
    // to hold the next value, allowing us to create the arrays to hold final
    // values at the correct depth. Then we'll keep digging into the array.
    if ((object[path] === undefined || object[path] === null) ||
      !Array.isArray(object[path])
    ) {
      object[path] = {}
    }

    object = object[path]
  }

  object[keys.shift()] = value

  return object
}

/**
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and y
 * is replaced with a random hexadecimal digit from 8 to b.
 *
 * https://gist.github.com/LeverOne/1308368
 *
 * @param {string} a
 * @param {string} b
 */
const uuid = (a, b) => { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b }

module.exports = {
  camelCase,
  matchAll,
  setValue,
  uuid
}
