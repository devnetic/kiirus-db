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
 * @param {*} item
 * @returns {boolean}
 */
const isOperation = (item: any): boolean => {
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
const isStatement = (key: string): boolean => {
  return getOperatorType(key) === 'logical'
  // return ['logical', 'aggregation'].includes(getOperatorType(key))
}

/**
 *
 * @param {Object} query
 * @param {string} [operand]
 * @returns {Token[]}
 */
// const getTokens = (query: ArrayLike<any>, operand?: string): Token[] => {
const getTokens = (query: any, operand?: string): Token[] => {
  const tokens: Token[] = []

  for (const [key, item] of Object.entries(query)) {
    const itemType = getItemType(item)
    const token: Token = { type: '', operator: '' }

    if (isOperator(key)) {
      if (isStatement(key)) {
        token.type = 'statement'
        token.operator = key
        token.children = []

        if (itemType === 'array') {
          for (const element of (item as any)) {
            token.children.push(...getTokens(element))
          }
        } else {
          token.children.push(...getTokens(item, operand))
        }
      } else if (getOperatorType(key) === 'aggregation') {
        token.type = 'aggregation'
        token.operand = operand
        token.operator = key

      token.children = [...getTokens(item, key)]
        // if (isOperation(item)) {
        //   token.children = [...getTokens(item, key)]
        // } else {
        //   token.value = item
        // }
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
 * @returns {Token[]}
 */
// export const parse = (query: ArrayLike<any>): Token[] => {
export const parse = (query: any): Token[] => {
  return getTokens(query)
}
