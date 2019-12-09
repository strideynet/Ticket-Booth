const logger = require('pino')({
  name: 'error-handler',
  level: process.env.LOG_LEVEL || 'info'
})

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
    logger.info(`${req.method} ${req.url} ${err.code} ${err.name} ${err.message}`)
  }

  if (err.code === 500) {
    err.req = {
      body: req.body,
      query: req.query,
      originalUrl: req.originalUrl
    }
    logger.error(err, 'a fatal error occured during a request')

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
