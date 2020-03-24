const { OPERATORS, RECORD_NAME, getOperatorType } = require('./common')

/**
 *
 * @param {Array<Object>} syntaxTree
 * @param {string} [type='query|aggregation']
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree, type = 'query', join = '&&') => {
  const compiled = []

  for (const token of syntaxTree) {
    if (token.type === 'statement') {
      compiled.push(`(${compile(token.children, type, getOperator(token.operator))})`)
    } else {
      const expression = compileExpression(token, type)

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

const compileArrayValues = (values) => {
  return `[${values.map(value => {
    const type = getType(value)

    if (type === 'string') {
      return `'${value}'`
    } else if (type === 'object') {
      return JSON.stringify(value)
    } else {
      return value
    }
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
 * @param {string} [type='query']
 * @returns {string}
 */
const compileExpression = (expression, type = 'query') => {
  const { operand, operator, value } = expression

  const valueType = getType(value)

  switch (valueType) {
    case 'array':
    case 'object':
      switch (operator) {
        case '$eq':
          return `getType(${RECORD_NAME}.${operand}) === 'array' ? ${compileFind(operand, value, valueType)} : isEqual(${RECORD_NAME}.${operand}, ${JSON.stringify(value)})`
        case '$filter':
          return compileFilter(operand, value, valueType)
        case '$in':
          return compileComparisonArray(operand, value)
        case '$nin':
          return `!${compileComparisonArray(operand, value)}`
        default:
          // TODO: Check if this block is dead code
          return value
      }
    case 'boolean':
    case 'number':
    case 'string':
      return `${RECORD_NAME}.${operand} ${getOperator(operator, type)} ${compileScalar(value)}`
    default:
      // TODO: Check if this block is dead code
      return operator ? getOperator(operator) : undefined
  }
}

const compileFilter = (operand, value, type) => {
  return `${RECORD_NAME}.${operand} = ${RECORD_NAME}.${operand}.filter(item => ${compileFilterValue(value, type)})`
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
const getOperator = (operator = '$eq', type = 'query') => {
  if (type === 'aggregation') {
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

module.exports = {
  compile
}
