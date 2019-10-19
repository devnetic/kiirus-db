// const { Database } = require('./../engine')

const { commands } = require('./../engine')
const { createError } = require('./../support')

const routes = [{
  type: 'post',
  path: '/',
  /**
   *
   * @param {IncomingMessage} request
   * @param {Response} response
  */
  handler: async (request, response) => {
    // const { command, options } = request.body
    // const [ type, operation ] = command.split('-')

    // console.log('command: %o', request.body)
    // console.log('type: %s, operation: %s', type, operation)

    console.log(typeof request.body)
    console.log(request.body)

    try {
      const result = await commands.run(request)

      response.json(result)
    } catch (e) {
      console.log(e.message)

      // TODO: return a proper message for more error types
      response.json(createError(e.message, request))
    }

    // const database = new Database()

    // switch (type) {
    //   case 'collection':
    //     database.use(options.database)

    //     try {
    //       database.getCollection(options.collection)[operation](options.data)
    //         .then((result) => {
    //           response.send(JSON.stringify(result))
    //         }).catch((error) => {
    //           console.log(error)

    //           response.send(JSON.stringify({ message: error.message }), 500)
    //         })
    //     } catch (e) {
    //       // TODO Manage the error in a proper way
    //       response.send(JSON.stringify({ message: 'Unexpected error.' }), 500)
    //     }

    //     break

    //   case 'database':
    //     try {
    //       database[operation](options).then((result) => {
    //         response.send(JSON.stringify(result))
    //       }).catch((error) => {
    //         console.log(error)

    //         response.send(error.message, 500)
    //       })
    //     } catch (error) {
    //       response.send(JSON.stringify({ message: 'Unexpected error.' }), 500)
    //     }

    //     break
    // }
  }
}]

module.exports = routes
