import { getErrorMessage } from '../../support'
import {
  OPERATORS,
  RECORD_NAME,
  getOperatorType,
  ComplexOperator
} from './common'
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
  commandType: string = 'query',
  join: ComplexOperator | string = '&&'
): string => {
  const compiled = []

  for (const token of syntaxTree) {
    switch (token.type) {
      case 'aggregation': {
        const expression = compileAggregation(token)

        if (expression) {
          compiled.push(expression)
        }

        break
      }

      case 'statement':
        compiled.push(`(${compile(token.children, commandType, getOperator(token.operator))})`)

        break

      default:
        const expression = compileExpression(token, commandType)

        if (expression) {
          compiled.push(expression)
        }
    }

    // if (token.type === 'statement') {
    //   compiled.push(`(${compile(token.children, commandType, getOperator(token.operator))})`)
    // } else {
    //   const expression = compileExpression(token, commandType)

    //   if (expression) {
    //     compiled.push(expression)
    //   }
    // }
  }

  if (getType(join) === 'object') {
    return (join as ComplexOperator).template.replace('BODY', compiled.join(` ${(join as ComplexOperator).join} `))
  }

  return compiled.join(`${formatJoin(join as string)}`)
}

const compileEqual = ( operand: string, value: any, valueType: string, commandType?: string): string => {
  if (commandType === 'query') {
    return `getType(${RECORD_NAME}.${operand}) === 'array' ? ${compileFind(operand, value, valueType)} : isEqual(${RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`
  }

  return `${RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`
}

const compileNotEqual = (operand: string, value: any, valueType: string): string => {
  return `!${compileEqual(operand, value, valueType)}`
}

const compileAggregation = (token: Token): string => {
  const { operand = '', operator, value, children } = token

  switch (operator) {
    case '$filter':
      // return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(record => ${value ? compileFilterValue2(value, getType(value)) : compile(children)})`
      // return `${RECORD_NAME}.${operand}.filter(record => ${value ? compileFilterValue2(value, getType(value)) : compile(children)})`
      // return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(record => ${value ? compileFilterValue2(value, getType(value)) : compile(children)})`
      return compileFilter(operand, value, children)

    default:
      return ''
  }
}

const compileExpression = (token: Token, commandType: string = 'query'): string => {
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
        // case '$filter':
        //   return compileFilter(operand, value, valueType)
        case '$in':
          return compileIn(operand, value, valueType)
        case '$ne':
          return compileNotEqual(operand, value, valueType)
        case '$nin':
          return compileNotIn(operand, value, valueType)
        case '$pull':
          return compilePull(operand, value, valueType)
        case '$push':
          return compilePush(operand, value, valueType)
      }
  }

  throw new Error(getErrorMessage('KDB0011'))
}

const compileFilter = (operand: string, value: any, children?: Token[]): string => {
  return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(record => ${value ? compileFilterValue(value, getType(value)) : compile(children)})`
}

// const compileFilter = (operand: string, value: any, valueType: string): string => {
//   return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(item => ${compileFilterValue(value, valueType)})`
// }

const compileFilterValue = (value: any, valueType: string): string => {
  if (valueType === 'object') {
    return `isEqual(record, ${JSON.stringify(value)})`
  } else {
    return `record === ${JSON.stringify(value)}`
  }
}

// const compileFilterValue = (value: any, valueType: string): string => {
//   if (valueType === 'object') {
//     return `isEqual(item, ${JSON.stringify(value)})`
//   } else {
//     return `${JSON.stringify(value)}.some(element => isEqual(item, element))`
//   }
// }

const compileFind = (operand: string, value: any, valueType: string): string => {
  return `${RECORD_NAME}.${operand}.find(item => ${compileFilterValue(value, valueType)})`
}

const compileIn = (operand: string, value: any, valueType: string): string => {
  return `${compileValue(value, valueType)}.includes(${RECORD_NAME}.${operand})`
}

const compileNotIn = (operand: string, value: any, valueType: string): string => {
  return `!${compileIn(operand, value, valueType)}`
}

const compilePull = (operand: string, value: any, valueType: string): string => {
  return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(item => !${compileFilterValue(value, valueType)})`
}

const compilePush = (operand: string, value: any, valueType: string): string => {
  return `${RECORD_NAME}.${operand}.push(${valueType === 'array' ? '...' : ''}${compileValue(value, valueType)})`
}

const compileValue = (value: any, type: string): string => {
  switch (type) {
    case 'array':
    case 'object':
      return JSON.stringify(value)
    case 'boolean':
    case 'number':
      return value
    case 'string':
      return `'${value}'`
  }

  throw new Error(getErrorMessage('KDB0012'))
}

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

  console.log(getOperatorType(operator))
  console.log(Reflect.get(OPERATORS, getOperatorType(operator)))
  console.log(Reflect.get(Reflect.get(OPERATORS, getOperatorType(operator)), operator))

  return Reflect.get(Reflect.get(OPERATORS, getOperatorType(operator)), operator) ?? undefined
}

/**
 * Return the operand type <array|logical|comparison|object|primitive>
 *
 * @param {*} value
 * @returns {string}
 */
const getType = (value: any): string => {
  if (Array.isArray(value)) {
    return 'array'
  } else if (Object.keys(OPERATORS.logical).includes(value)) {
    return 'logical'
  } else if (Object.keys(OPERATORS.comparison).includes(value)) {
    return 'comparison'
  } else {
    return typeof value
  }
}
