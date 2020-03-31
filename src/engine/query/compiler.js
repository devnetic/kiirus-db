import { OPERATORS, RECORD_NAME, getOperatorType } from './common'

/**
 *
 * @param {Array<Object>} syntaxTree
 * @param {string} [type='query|aggregation']
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree, commandType = 'query', join = '&&') => {
  const compiled = []

  for (const token of syntaxTree) {
    if (token.type === 'statement') {
      compiled.push(`(${compile(token.children, commandType, getOperator(token.operator))})`)
    } else {
      const expression = compileExpression(token, commandType)

      if (expression) {
        compiled.push(expression)
      }
    }
  }

  if (getType(join) === 'object') {
    return join.template.replace('BODY', compiled.join(` ${join.join} `))
  }

  return compiled.join(`${formatJoin(join)}`)
}

const compileEqual = (operand, operator, value, valueType, commandType) => {
  if (commandType === 'query') {
    // return `isEqual(${RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`
    return `getType(${RECORD_NAME}.${operand}) === 'array' ? ${compileFind(operand, operator, value, valueType)} : isEqual(${RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`
  }

  return `${RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`
}

const compileNotEqual = (operand, value, valueType) => {
  return `!${compileEqual(operand, value, valueType)}`
}

// const compileEqual = (token, commandType, valueType) => {
//   const { operand, operator, value } = token

//   // const valueType = getType(value)

//   if (commandType === 'query') {
//     return `${RECORD_NAME}.${operand} === ${compileValue(value, valueType)}`
//   } else {
//     return `${RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`
//   }
// }

const compileExpression = (token, commandType = 'query') => {
  const { operand, operator, value } = token

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
          return compileEqual(operand, operator, value, valueType, commandType)
        case '$filter':
          return compileFilter(operand, operator, value, valueType)
        case '$in':
          return compileIn(operand, value, valueType)
        case '$ne':
          return compileNotEqual(operand, value, valueType)
        case '$nin':
          return compileNotIn(operand, value, valueType)
        case '$pull':
          return compilePull(operand, operator, value, valueType)
        case '$push':
          return compilePush(operand, value, valueType)
      }
  }

  // switch (operator) {
  //   case '$ne':
  //   case '$eq':
  //     // return compileEqual(token, commandType, valueType)
  //     switch (valueType) {
  //       case 'array':
  //       case 'object':
  //         if (commandType === 'query') {
  //           // return compileRuntimeExpression(operand, operator, value)
  //           return `isEqual(${RECORD_NAME}.${operand}, ${compileValue(value, valueType)})`
  //         } else {
  //           return `${RECORD_NAME}.${operand} = ${compileValue(value, valueType)}`
  //         }
  //       default:
  //         return `${RECORD_NAME}.${operand} ${getOperator(operator, commandType)} ${compileValue(value, valueType)}`
  //     }
  // }

  // switch (valueType) {
  //   case 'object':

  //   case 'number':
  //   case 'string':
  //     return `${RECORD_NAME}.${operand} ${getOperator(operator, type)} ${compileValue(value, valueType)}`
  // }
}

const compileFilter = (operand, operator, value, valueType) => {
  return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(item => ${compileFilterValue(value, valueType)})`
}

const compileFind = (operand, operator, value, valueType) => {
  return `${RECORD_NAME}.${operand}.find(item => ${compileFilterValue(value, valueType)})`
}

const compileFilterValue = (value, valueType) => {
  if (valueType === 'object') {
    return `isEqual(item, ${JSON.stringify(value)})`
  } else {
    return `${JSON.stringify(value)}.some(element => isEqual(item, element))`
  }
}

const compileIn = (operand, value, valueType) => {
  return `${compileValue(value, valueType)}.includes(${RECORD_NAME}.${operand})`
}

const compileNotIn = (operand, value, valueType) => {
  return `!${compileIn(operand, value, valueType)}`
}

const compilePull = (operand, operator, value, valueType) => {
  return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(item => !${compileFilterValue(value, valueType)})`
}

const compilePush = (operand, value, valueType) => {
  return `${RECORD_NAME}.${operand}.push(${valueType === 'array' ? '...' : ''}${compileValue(value, valueType)})`
}

const compileValue = (value, type) => {
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
}

const formatJoin = (join) => {
  return join === ';' ? `${join} ` : ` ${join} `
}

/**
 * Get the language operator symbol for the given query symbol
 *
 * @param {string} [operator='$eq']
 * @param {string} [type='query|aggregation']
 * @returns {string}
 */
const getOperator = (operator = '$eq', commandType = 'query') => {
  if (commandType === 'aggregation') {
    return '='
  }

  return OPERATORS[getOperatorType(operator)][operator] || undefined
}

/**
 * Return the operand type <array|logical|comparison|object|primitive>
 *
 * @param {*} value
 * @returns {string}
 */
const getType = (value) => {
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

export default compile
