const debugLog = require('debug')('ticket-booth:log')
const debugError = require('debug')('ticket-booth:err')

debugLog.log = console.log.bind(console)

class GenericError extends Error {
  constructor (message, code = 500) {
    super(message)
    this.name = this.constructor.name
    this.code = code

    Error.captureStackTrace(this, GenericError)
  }
}

class ValidationError extends GenericError {
  constructor (fieldName, suppliedValue, fault) {
    super(fieldName + ': ' + fault, 422)
    this.meta = {
      fieldName,
      suppliedValue
    }
  }
}

const types = {
  GenericError,
  ValidationError
}

function genericErrorHandler (err, req, res, next) {
  err.code = err.code || 500

  if (err.code < 500) {
    debugLog(`${req.method} ${req.url} ${err.code} ${err.name} ${err.message}`)
  }

  if (err.code === 500) {
    debugError(`${req.method} ${req.url} ${err.code} ${err.name} ${err.message}`)
    debugError(err)

    debugError(req.body || 'no body')

    debugError('jwt if applicable:')
    debugError(req.get('Authorization') || 'no auth')

    debugError('end of error')

    err.name = 'ServerError'
    err.message = 'Something went wrong. This incident has been logged.'
    err.meta = {}
  }

  res.status(err.code).json({
    name: err.name,
    code: err.code,
    message: err.message,
    meta: err.meta
  })
}

module.exports = { ...types, genericErrorHandler }
