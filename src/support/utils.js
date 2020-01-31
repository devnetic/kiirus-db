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
 * Returns date formatted according to given format
 *
 * @param {Date} time
 * @param {string} format
 * @param {Array<string>} [monthNames]
 * @param {Array<string>} [dayNames]
 * @returns {string}
 */
const dateFormat = (time, format, monthNames, dayNames) => {
  // a global month names array
  monthNames = monthNames || [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  // a global day names array
  dayNames = dayNames || [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  if (!time) {
    return ''
  }

  return format.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hh|HH|nn|ss|a|A)/gi,
    ($1) => {
      switch ($1) {
        // A full numeric representation of a year, 4 digits. 1999 or 2003
        case 'yyyy':
          return time.getFullYear()
        // A full textual representation of a month, such as January or March. January through December
        case 'mmmm':
          return monthNames[time.getMonth()]
        // A short textual representation of a month, three letters. Jan through Dec
        case 'mmm':
          return monthNames[time.getMonth()].substr(0, 3)
        // Numeric representation of a month, with leading zeros. 01 through 12
        case 'mm':
          return String(time.getMonth() + 1).padStart(2, '0')
        // ISO-8601 numeric representation of the day of the week. 1 (for Monday) through 7 (for Sunday)
        case 'dddd':
          return dayNames[time.getDay()]
        // A textual representation of a day, three letters. Mon through Sun
        case 'ddd':
          return dayNames[time.getDay()].substr(0, 3)
        // Day of the month, 2 digits with leading zeros. 01 to 31
        case 'dd':
          return String(time.getDate()).padStart(2, '0')
        // 12-hour format of an hour with leading zeros. 01 through 12
        case 'hh': {
          // const hour = time.getUTCHours() % 12
          const hour = time.getHours() - (time.getTimezoneOffset() / 60)

          return String(hour || 12).padStart(2, 0)
        }
        // 24-hour format of an hour with leading zeros. 00 through 23
        case 'HH':
          return String(time.getHours()).padStart(2, '0')
        // Minutes with leading zeros. 00 to 59
        case 'nn':
          return String(time.getMinutes()).padStart(2, '0')
        // Seconds, with leading zeros. 00 through 59
        case 'ss':
          return String(time.getSeconds()).padStart(2, '0')
        // Lowercase Ante meridiem and Post meridiem. am or pm
        case 'a':
          return time.getHours() < 12 ? 'am' : 'pm'
        // Microseconds
        case 'u':
          return time.getMilliseconds() * 1000
        // Uppercase Ante meridiem and Post meridiem. AM or PM
        case 'A':
          return time.getHours() < 12 ? 'AM' : 'PM'
      }
    }
  )
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
const kebabCase = (value) => {
  return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
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
 * Transform a duration in miliseconds to human readable 'HH:mm:ss.m' format
 *
 * @param {number} duration
 * @returns {string}
 */
const msToTime = (duration) => {
  const milliseconds = parseInt((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return `${hours}:${minutes}:${seconds}.${milliseconds}`
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
  dateFormat,
  kebabCase,
  matchAll,
  msToTime,
  setValue,
  uuid
}
