const { GenericError } = require('./errors')
const db = require('../db')
const jwt = require('./jwt')

const asyncWrapper = func => (req, res, next) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}

const authMiddleware = (req, res, next) => {
  const auth = req.get('Authorization') && req.get('Authorization').split(' ')
  if (auth && auth[0] === 'Bearer' && auth[1]) {
    jwt.decode(auth[1])
      .catch(e => {
        if (e.name === 'TokenExpiredError') {
          throw new GenericError('Token expired. Log in again.', 401)
        }

        throw e // rethrow
      })
      .then(decoded => db.models.User.findOne({ where: { id: decoded.userID } }))
      .then(user => {
        if (!user) {
          const err = new GenericError('Invalid User Supplied in jwt')
          err.meta = auth[1]

          throw err
        }

        req.user = user
        next()
      })
      .catch(next)
  } else {
    throw new GenericError('No token provided.', 401)
  }
}

module.exports = {
  asyncWrapper,
  authMiddleware
}
