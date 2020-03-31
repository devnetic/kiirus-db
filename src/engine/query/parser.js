import { OPERATORS, getOperatorType } from './common'

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
 * @param {*} item
 * @returns {boolean}
 */
const isOperation = (item) => {
  return Object.entries(item).some(([key]) => {
    return isOperator(key)
  })
}

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
 * @param {string} key
 * @returns {boolean}
 */
const isStatement = (key) => {
  return getOperatorType(key) === 'logical'
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

    if (isOperator(key)) {
      if (isStatement(key)) {
        token.type = 'statement'
        token.operator = key
        token.children = []

        if (itemType === 'array') {
          for (const element of item) {
            token.children.push(...getTokens(element))
          }
        } else {
          token.children.push(...getTokens(item, operand))
        }
      } else {
        token.type = 'expression'
        token.operand = operand
        token.operator = key
        token.value = item
      }

      tokens.push(token)
    } else {
      if (isOperation(item)) {
        tokens.push(...getTokens(item, key))
      } else {
        token.type = 'expression'
        token.operator = '$eq'
        token.operand = key
        token.value = item

        tokens.push(token)
      }
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

export default parse
