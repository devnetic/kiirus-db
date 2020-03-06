const { OPERATORS, RECORD_NAME } = require('./common')

/**
 *
 * @param {Array<Object>} syntaxTree
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree, join = '&&') => {
  const compiled = []

  for (const token of syntaxTree) {
    // if (token.children) {
    if (token.type === 'statement') {
      let children = `(${compile(token.children, getOperator(token.operator))})`

      if (token.type === 'expression') {
        children = children.replace('OPERAND', `${RECORD_NAME}.${token.operand}`)
      }

      compiled.push(children)
    } else {
    // if (token.type === 'expression') {
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

/**
 *
 * @param {Array} values
 * @param {string} key
 * @returns {string}
 */
const compileComparisonArray = (key, values) => {
  return `[${values.map(value => compileScalar(value)).join(',')}].includes(${RECORD_NAME}.${key})`
}

const compileArrayValues = (values) => {
  return `[${values.map(value => {
    return getType(value) === 'string' ? `'${value}'` : value
  })}]`
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
      switch (operator) {
        case '$filter':
          return compileFilter(operand, value)
        case '$in':
          return compileComparisonArray(operand, value)
        case '$nin':
          return `!${compileComparisonArray(operand, value)}`
      }

      break
    case 'boolean':
    case 'number':
    case 'string':
      // TODO: Check if this block is dead code
      if (operand === null) {
        return `${getOperator(operator)} ${compileScalar(value)}`
      }

      return `${RECORD_NAME}.${operand} ${getOperator(operator)} ${compileScalar(value)}`
    default:
      // TODO: Check if this block is dead code
      return operator ? getOperator(operator) : undefined
  }
}

const compileFilter = (operand, values) => {
  // return `${RECORD_NAME}.${operand}.filter(item => ${compileArrayValues(value)}.includes(item))`
  return `[${values.map(value => compileScalar(value)).join(',')}].filter(value => isEqual(value, ${RECORD_NAME}.${operand}))`
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
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperator = (operator = '$eq') => {
  return OPERATORS[getOperatorType(operator)][operator] || undefined
}

/**
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperatorType = (operator) => {
  if (Object.keys(OPERATORS.logical).includes(operator)) {
    return 'logical'
  } else if (Object.keys(OPERATORS.comparison).includes(operator)) {
    return 'comparison'
  } else if (Object.keys(OPERATORS.aggregation).includes(operator)) {
    return 'aggregation'
  }
}

/**
 *
 * @param {*} item
 * @returns {}
 */
const getType = (item) => {
  if (Array.isArray(item)) {
    return 'array'
  } else if (Object.keys(OPERATORS.logical).includes(item)) {
    return 'logical'
  } else if (Object.keys(OPERATORS.comparison).includes(item)) {
    return 'comparison'
  } else {
    return typeof item
  }
}

module.exports = {
  compile
}
