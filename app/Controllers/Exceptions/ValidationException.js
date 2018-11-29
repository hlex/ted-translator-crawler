'use strict'

class ValidationException extends Error {
  constructor (code, messages) {
    super()
    this.code = code
    this.messages = messages
  }
}

module.exports = ValidationException
