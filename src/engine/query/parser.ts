import { Query } from './../entities'
import { OPERATORS, getOperatorType } from './common'

export interface Token {
  type: string
  operator: string
  operand?: string
  value?: unknown
  children?: Token[]
}

/**
 *
 * @param {*} item
 * @returns {string}
 */
const getItemType = (item: unknown): string => {
  if (Array.isArray(item)) {
    return 'array'
  } else {
    return typeof item
  }
}

/**
 *
 * @param {ArrayLike<unknown>} item
 * @returns {boolean}
 */
const isOperation = (item: ArrayLike<unknown>): boolean => {
  return Object.entries(item).some(([key]) => {
    return isOperator(key)
  })
}

/**
 *
 * @param {string} element
 * @returns {boolean}
 */
const isOperator = (element: string): boolean => {
  if (
    Object.keys(OPERATORS.logical).includes(element) ||
    Object.keys(OPERATORS.comparison).includes(element) ||
    Object.keys(OPERATORS.aggregation).includes(element)
  ) {
    return true
  }

  return false
}

/**
 *
 * @param {Query} query
 * @param {string} [operand]
 * @returns {Token[]}
 */
const getTokens = (query: Query, operand?: string): Token[] => {
  const tokens: Token[] = []

  for (const [key, item] of Object.entries(query) as [string, any]) {  // eslint-disable-line
    const token: Token = { type: '', operator: '' }
    const itemType = getItemType(item)

    if (isOperator(key)) {
      const operatorType = getOperatorType(key)

      switch (operatorType) {
        case 'aggregation':
          token.type = 'aggregation'
          token.operand = operand
          token.operator = key
          token.children = [...getTokens(item, key)]

          break

        case 'comparison':
          token.type = 'expression'
          token.operand = operand
          token.operator = key
          token.value = item

          break

        case 'logical':
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

          break
      }

      tokens.push(token)
    } else if (isOperation(item)) {
      tokens.push(...getTokens(item, key))
    } else {
      token.type = 'expression'
      token.operand = key
      token.operator = '$eq'
      token.value = item

      tokens.push(token)
    }
  }

  return tokens
}

/**
 *
 * @param {Query} query
 * @returns {Token[]}
 */
export const parse = (query: Query): Token[] => {
  return getTokens(query)
}
