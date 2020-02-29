const RECORD_NAME = 'record'

const operators = {
  comparison: {
    $eq: '===',
    $gt: '>',
    $gte: '>=',
    $in: '$in',
    $lt: '<',
    $lte: '<=',
    $ne: '!==',
    $nin: '$nin'
  },
  logical: {
    $and: '&&',
    $nor: { name: '$nor', template: '!(BODY)', join: '||' },
    $not: { name: '$not', template: '!(OPERAND BODY)', join: '&&' },
    $or: '||'
  },
  aggregation: {
    $filter: 'filter'
  },
  array: ['$filter', '$in', '$nin']
}

/**
 *
 * @param {string} compiled
 * @returns {Function}
 */
const build = (compiled) => {
  return new Function(RECORD_NAME, `return ${compiled || true}`) // eslint-disable-line
}

/**
 *
 * @param {Array<Object>} syntaxTree
 * @param {string} [join='&&']
 * @returns {string}
 */
const compile = (syntaxTree, join = '&&') => {
  const compiled = []

  for (const token of syntaxTree) {
    if (token.children) {
      let children = `(${compile(token.children, getOperator(token.operator))})`

      if (token.type === 'expression') {
        children = children.replace('OPERAND', `${RECORD_NAME}.${token.operand}`)
      }

      compiled.push(children)
    }

    if (token.type === 'expression' || token.type === 'expression-partial') {
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
const compileComparisonArray = (values, key) => {
  return `[${values.map(value => {
    return getType(value) === 'string' ? `'${value}'` : value
  })}].includes(${RECORD_NAME}.${key})`
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
        case '$in':
          return compileComparisonArray(value, operand)
        case '$nin':
          return `!${compileComparisonArray(value, operand)}`
      }

      break
    case 'boolean':
    case 'number':
    case 'string':
      if (operand === null) {
        return `${getOperator(operator)} ${compileScalar(value)}`
      }

      return `${RECORD_NAME}.${operand} ${getOperator(operator)} ${compileScalar(value)}`
    default:
      return operator ? getOperator(operator) : undefined
  }
}

/**
 *
 * @param {*} value
 * @returns {*}
 */
const compileScalar = (value) => {
  if (getType(value) === 'string') {
    return `'${value}'`
  }

  return value
}

/**
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperator = (operator = '$eq') => {
  return operators[getOperatorType(operator)][operator] || undefined
}

/**
 *
 * @param {string} operator
 * @returns {string}
 */
const getOperatorType = (operator) => {
  if (Object.keys(operators.logical).includes(operator)) {
    return 'logical'
  } else if (Object.keys(operators.comparison).includes(operator)) {
    return 'comparison'
  } else if (Object.keys(operators.aggregation).includes(operator)) {
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
  } else if (Object.keys(operators.logical).includes(item)) {
    return 'logical'
  } else if (Object.keys(operators.comparison).includes(item)) {
    return 'comparison'
  } else {
    return typeof item
  }
}

/**
 *
 * @param {string} element
 * @returns {boolean}
 */
const isOperator = (element) => {
  if (Object.keys(operators.logical).includes(element) ||
    Object.keys(operators.comparison).includes(element) ||
    Object.keys(operators.aggregation).includes(element)
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
const getTokens = (query) => {
  const tokens = []

  for (const [key, item] of Object.entries(query)) {
    const itemType = getItemType(item)
    const token = {}

    if (['logical', 'aggregation'].includes(getOperatorType(key))) {
      token.type = 'statement'
      token.operator = key

      const statement = parseStatement(item, key, itemType)

      if (statement) {
        token.children = statement
      } else {
        token.type = 'expression'
        token.operand = key
        token.value = item
      }
    } else {
      token.type = 'expression'

      if (itemType === 'object') {
        const expression = parseExpression(item, itemType)

        if (expression[0].type === 'expression-partial') {
          token.operator = expression[0].operator
          token.operand = key
          token.value = expression[0].value
        } else {
          token.operand = key
          token.children = expression
        }
      } else {
        if (isOperator(key)) {
          token.type = 'expression-partial'
          token.operator = key
          token.operand = null
        } else {
          token.operator = '$eq'
          token.operand = key
        }

        token.value = item
      }
    }

    tokens.push(token)
  }

  return tokens
}

/**
 *
 * @param {Array<Object>} item
 * @param {string} operator
 * @returns {Array<Object>}
 */
const parseArray = (item, operator) => {
  if (operators.array.includes(operator)) {
    return
  }

  const tokens = []

  for (const element of item) {
    tokens.push(...getTokens(element))
  }

  return tokens
}

/**
 *
 * @param {Object} expression
 * @param {string} itemType
 * @returns {Object}
 */
const parseExpression = (expression, itemType) => {
  if (itemType === 'object') {
    return getTokens(expression)
  }

  const values = Object.entries(expression)[0]

  return { operator: values[0], value: values[1] }
}

/**
 *
 * @param {Object} statement
 * @param {string} operator
 * @param {string} itemType
 * @returns {Array<Object>}
 */
const parseStatement = (statement, operator, itemType) => {
  if (itemType === 'array') {
    return parseArray(statement, operator)
  } else if (itemType === 'object') {
    return getTokens(statement)
  }
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
  build,
  compile,
  parse
}
