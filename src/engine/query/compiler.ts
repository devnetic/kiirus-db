import { getErrorMessage } from '../../support'
import { OPERATORS, RECORD_NAME, getOperatorType, ComplexOperator } from './common'
import { Token } from './parser'

/**
 *
 * @param {Array<Token>} syntaxTree
 * @param {string} [type='query|aggregation']
 * @param {string} [join='&&']
 * @returns {string}
 */
export const compile = (
  syntaxTree: Token[] = [],
  commandType = 'query',
  join: ComplexOperator | string = '&&'
): string => {
  const compiled: string[] = []

  for (const token of syntaxTree) {
    switch (token.type) {
      case 'aggregation': {
        const aggregation = compileAggregation(token, commandType)

        if (aggregation !== undefined) {
          compiled.push(aggregation)
        }

        break
      }

      case 'expression': {
        const expression = compileExpression(token, commandType)

        if (expression !== undefined) {
          compiled.push(expression)
        }

        break
      }

      case 'statement':
        compiled.push(`(${compile(token.children, commandType, getOperator(token.operator))})`)
        break
    }
  }

  if (getType(join) === 'object') {
    return (join as ComplexOperator).template.replace('BODY', compiled.join(` ${(join as ComplexOperator).join} `))
  }

  return compiled.join(`${formatJoin(String(join))}`)
}

/**
 *
 * @param {Token} token
 * @param {string} commandType
 * @returns {string}
 */
const compileAggregation = (token: Token, commandType: string): string => {
  const { operand, operator } = token

  switch (operator) {
    case '$filter':
      if (commandType === 'query') {
        return `${RECORD_NAME}.${String(operand)}.filter(record => (${compile(token.children)})).length > 0`
      } else {
        return `${RECORD_NAME}.${String(operand)} = ${RECORD_NAME}.${String(operand)}.filter(record => (${compile(
            token.children
          )}))`
      }
  }

  throw new Error(getErrorMessage('KDB0011'))
}

/**
 *
 * @param {string} operand
 * @param {*} value
 * @param {string} valueType
 * @param {string} commandType
 */
const compileEqual = (operand: string, value: unknown, valueType: string, commandType?: string): string => {
  if (commandType === 'query') {
    if (['array', 'object'].includes(valueType)) {
      return `isEqual(${RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`
    }
  }

  return `${RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`
}

/**
 *
 * @param {Token} token
 * @param {string} commandType
 * @returns {string}
 */
const compileExpression = (token: Token, commandType = 'query'): string => {
  const { operand = '', operator, value } = token

  const valueType = getType(value)

  switch (valueType) {
    case 'boolean':
    case 'number':
    case 'string':
      return `${RECORD_NAME}.${operand} ${getOperator(operator, commandType)} ${compileValue(value, valueType)}`

    case 'array':
    case 'object':
      switch (operator) {
        case '$eq':
          return compileEqual(operand, value, valueType, commandType)
        case '$in':
          return compileIn(operand, value, valueType)
        case '$nin':
          return `!${compileIn(operand, value, valueType)}`
      }
  }

  throw new Error(getErrorMessage('KDB0011'))
}

const compileIn = (operand: string, value: unknown, valueType: string): string => {
  return `[].concat(${RECORD_NAME}.${operand}).filter(item => ${compileValue(
    value,
    valueType
  )}.some(element => isEqual(item, element))).length > 0`
}

/**
 *
 * @param {*} value
 * @param {string} type
 * @returns {string}
 */
const compileValue = (value: unknown, type: string): string => {
  switch (type) {
    case 'array':
    case 'object':
      return JSON.stringify(value)
    case 'boolean':
    case 'number':
      return value as string
    case 'string':
      return `"${String(value)}"`
  }

  throw new Error(getErrorMessage('KDB0012'))
}

/**
 *
 * @param {string} join
 * @returns {string}
 */
const formatJoin = (join: string): string => {
  return join === ';' ? `${join} ` : ` ${join} `
}

/**
 * Get the language operator symbol for the given query symbol
 *
 * @param {string} [operator='$eq']
 * @param {string} [type='query|aggregation']
 * @returns {string}
 */
const getOperator = (operator = '$eq', commandType = 'query'): string => {
  if (commandType === 'aggregation') {
    return '='
  }

  return (OPERATORS as any)[getOperatorType(operator)][operator] || undefined; // eslint-disable-line
}

/**
 * Return the operand type <array|logical|comparison|object|primitive>
 *
 * @param {*} value
 * @returns {string}
 */
const getType = (value: unknown): string => {
  if (Array.isArray(value)) {
    return 'array'
  } else if (Object.keys(OPERATORS.logical).includes(value as string)) {
    return 'logical'
  } else if (Object.keys(OPERATORS.comparison).includes(value as string)) {
    return 'comparison'
  } else {
    return typeof value
  }
}
