const { RECORD_NAME } = require('./common')

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const build = (compiled) => {
  return new Function(RECORD_NAME, 'isEqual', `debugger; return ${compiled || true}`) // eslint-disable-line
}

module.exports = {
  build
}
