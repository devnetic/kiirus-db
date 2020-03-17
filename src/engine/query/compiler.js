const { OPERATORS, RECORD_NAME, getOperatorType } = require('./common')

/**
 *
 * @param {Array<Object>} syntaxTree
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree, join = '&&') => {
  const compiled = []

  for (const token of syntaxTree) {
    if (token.type === 'statement') {
      compiled.push(`(${compile(token.children, getOperator(token.operator))})`)
    } else {
      const expression = compileExpression(token)

      if (expression) {
        compiled.push(expression)
      }
    }
  }

  if (getType(join) === 'object') {
    return join.template.replace('BODY', compiled.join(` ${join.join} `))
  }

  return compiled.join(` ${join} `)
}

const compileArrayValues = (values) => {
  return `[${values.map(value => {
    return getType(value) === 'string' ? `'${value}'` : value
  })}]`
}

/**
 *
 * @param {Array} values
 * @param {string} key
 * @returns {string}
 */
const compileComparisonArray = (key, values) => {
  return `[${values.map(value => compileScalar(value)).join(',')}].includes(${RECORD_NAME}.${key})`
}

/**
 *
 * @param {Object} expression
 * @returns {string}
 */
const compileExpression = (expression) => {
  const { operand, operator, value } = expression

  const type = getType(value)

  switch (type) {
    case 'array':
    case 'object':
      switch (operator) {
        case '$eq':
          return `getType(${RECORD_NAME}.${operand}) === 'array' ? ${compileFind(operand, value, type)} : isEqual(${RECORD_NAME}.${operand}, ${JSON.stringify(value)})`
        case '$filter':
          return compileFilter(operand, value, type)
        case '$in':
          return compileComparisonArray(operand, value)
        case '$nin':
          return `!${compileComparisonArray(operand, value)}`
        default:
          return value
      }
    case 'boolean':
    case 'number':
    case 'string':
      return `${RECORD_NAME}.${operand} ${getOperator(operator)} ${compileScalar(value)}`
    default:
      // TODO: Check if this block is dead code
      return operator ? getOperator(operator) : undefined
  }
}

const compileFilter = (operand, value, type) => {
  return `${RECORD_NAME}.${operand}.filter(item => ${compileFilterValue(value, type)})`
}

const compileFind = (operand, value, type) => {
  return `${RECORD_NAME}.${operand}.find(item => ${compileFilterValue(value, type)})`
}

const compileFilterValue = (value, type) => {
  if (type === 'object') {
    return `isEqual(item, ${JSON.stringify(value)})`
  } else if (type === 'array') {
    return `${compileArrayValues(value)}.some(element => isEqual(element, item))`
  }
}

/**
 *
 * @param {*} value
 * @returns {*}
 */
const compileScalar = (value) => {
  return typeof value === 'string' ? `'${value}'` : value
}

/**
 * Get the language operator symbol for the given query symbol
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperator = (operator = '$eq') => {
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

module.exports = {
  compile
}
