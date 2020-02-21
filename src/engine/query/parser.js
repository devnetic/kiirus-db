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
    $nor: '!',
    $not: '!',
    $or: '||'
  },
  aggregation: {
    $filter: 'filter'
  },
  array: ['$filter', '$in', '$nin']
}

const build = () => { }

const getOperatorType = (element) => {
  if (Object.keys(operators.logical).includes(element)) {
    return 'logical'
  } else if (Object.keys(operators.comparison).includes(element)) {
    return 'comparison'
  } else if (Object.keys(operators.aggregation).includes(element)) {
    return 'aggregation'
  }
}

const isOperator = (element) => {
  if (Object.keys(operators.logical).includes(element) ||
    Object.keys(operators.comparison).includes(element) ||
    Object.keys(operators.aggregation).includes(element)
  ) {
    return true
  }

  return false
}

const getItemType = (item) => {
  if (Array.isArray(item)) {
    return 'array'
  } else {
    return typeof item
  }
}

const getTokens = (query) => {
  const tokens = []

  for (const [key, item] of Object.entries(query)) {
    const itemType = getItemType(item)
    const token = {}

    if (isOperator(key)) {
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

        if (expression[0].type === 'expression') {
          token.operator = expression[0].operator
          token.operand = key
          // token.operand = expression[0].operand
          token.value = expression[0].value
        } else {
          // token.type = 'statement'
          token.operand = key
          token.children = expression
        }
      } else {
        token.operator = '$eq'
        token.operand = key
        token.value = item
      }
    }

    tokens.push(token)
  }

  return tokens
}

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

const parseExpression = (expression, itemType) => {
  if (itemType === 'object') {
    return getTokens(expression)
  }

  const values = Object.entries(expression)[0]

  return { operator: values[0], value: values[1] }
}

const parseStatement = (statement, operator, itemType) => {
  if (itemType === 'array') {
    return parseArray(statement, operator)
  } else if (itemType === 'object') {
    return getTokens(statement)
  }
}

const parse = (query) => {
  return getTokens(query)
}

module.exports = {
  parse
}
