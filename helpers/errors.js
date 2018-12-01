const debug = require('debug')('ticket-booth:error-handler')

class ValidationError extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, ValidationError)
  }
}
class ExternalAPIError extends Error {}
class DatabaseError extends Error {}

const types = {
  DatabaseError,
  ExternalAPIError,
  ValidationError
}

function DebugError (err, req, res ,next) {
  debug(err)

  next(err)
}

function ValidationErrorHandler (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      type: 'Validation Error',
      message: err.message
    })
  }
  next(err)
}

function ExternalAPIErrorHandler (err, req, res, next) {
  if (err instanceof ExternalAPIError) {
    return res.status(500).json({
      type: 'External API Error'
    })
  }
  next(err)
}

function DatabaseErrorHandler (err, req, res, next) {
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      type: 'Database Error',
      message: 'Something went wrong communicating with the database'
    })
  }
  next(err)
}

function GenericErrorHandler (err, req, res, next) {
  return res.status(500).json({
    type: 'Server Error',
    message: 'Something went wrong!'
  })
}

function handlerAdder (app) {
  app.use(DebugError)
  app.use(ValidationErrorHandler)
  app.use(ExternalAPIErrorHandler)
  app.use(DatabaseErrorHandler)
  app.use(GenericErrorHandler)
}

module.exports = {types, handlerAdder}
