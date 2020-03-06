const { OPERATORS } = require('./common')

/**
 *
 * @param {string} element
 * @returns {boolean}
 */
const isOperator = (element) => {
  if (Object.keys(OPERATORS.logical).includes(element) ||
    Object.keys(OPERATORS.comparison).includes(element) ||
    Object.keys(OPERATORS.aggregation).includes(element)
  ) {
    return true
  }

  return false
}

/**
 *
 * @param {*} item
 * @returns {string}
 */
const getItemType = (item) => {
  if (Array.isArray(item)) {
    return 'array'
  } else {
    return typeof item
  }
}

const getOperand = (key, operand) => {
  return !isOperator(key) ? key : (operand !== undefined ? operand : undefined)
}

/**
 *
 * @param {Object} query
 * @returns {Array<Object>}
 */
const getTokens = (query, operand) => {
  const tokens = []

  for (const [key, item] of Object.entries(query)) {
    const itemType = getItemType(item)
    const token = {}

    switch (itemType) {
      case 'array':
        if (!isOperator(key)) {
          token.operator = '$eq'
        } else {
          token.operator = key
        }

        if (OPERATORS.array.includes(key)) {
          token.type = 'expression'
          token.operand = operand

          token.value = item
        } else {
          token.type = 'statement'
          token.children = []

          for (const element of item) {
            token.children.push(...getTokens(element))
          }
        }

        tokens.push(token)

        break

      case 'object': {
        const parsedTokens = getTokens(item, getOperand(key, operand))

        if (isOperator(key)) {
          token.type = 'statement'
          token.operator = key
          token.children = [...parsedTokens]

          tokens.push(token)
        } else {
          tokens.push(...parsedTokens)
        }

        break
      }

      default:
        token.type = 'expression'
        token.value = item

        if (isOperator(key)) {
          token.operator = key
          token.operand = operand
        } else {
          token.operand = key
          token.operator = '$eq'
        }

        tokens.push(token)

        break
    }
  }

  return tokens
}

/**
 *
 * @param {Object} query
 * @returns {Array<Object>}
 */
const parse = (query) => {
  return getTokens(query)
}

module.exports = {
  parse
}
