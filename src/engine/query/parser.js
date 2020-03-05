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

    if (itemType === 'object') {
      const partialExpression = getTokens(item, !isOperator(key) ? key : undefined)[0]

      if (isOperator(key)) {
        if (operand) {
          partialExpression.operand = operand
        }

        token.type = 'statement'
        token.operator = key
        token.children = [partialExpression]

        tokens.push(token)
      } else {
        if (partialExpression.type === 'expression') {
          partialExpression.operand = key // TODO: Testing this
        }

        tokens.push(partialExpression)
      }
    } else if (itemType === 'array') {
      if (!isOperator(key)) {
        token.operator = '$eq'
      } else {
        token.operator = key
      }

      if (OPERATORS.array.includes(key)) {
        token.type = 'expression'

        token.value = item
      } else {
        token.type = 'statement'
        token.children = []

        for (const element of item) {
          token.children.push(...getTokens(element))
        }
      }

      tokens.push(token)
    } else {
      token.type = 'expression'

      if (isOperator(key)) {
        token.operator = key
        token.operand = null
      } else {
        token.operand = key
        token.operator = '$eq'
      }

      token.value = item
      tokens.push(token)
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
