'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

const _ = require('lodash')
const AppController = require('../Controllers/Core/AppController')
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  constructor () {
    super()
    this.appController = new AppController()
  }
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, params, response }) {
    const errorName = error.name
    const errorCase = ['Error', 'ValidationException', 'ModelNotFoundException']
    if (_.includes(errorCase, errorName) || !errorName) {
      const responseWithError = this.appController.responseWithError({ request, params, errorCode: error.code, errors: [error] })
      console.log('[handle]', responseWithError)
      response.status(responseWithError.code).send(responseWithError)
    } else {
      response.status(error.status).send(error.message)
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
