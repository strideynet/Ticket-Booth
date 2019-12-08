const { GenericError } = require('./errors')
const db = require('../db')
const jwt = require('./jwt')

const asyncWrapper = func => (req, res, next) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}

const authMiddleware = async (req, res, next) => {
  try {
    let authHeader = null
    if (req.get('Authorization')) {
      const authSplit = req.get('Authorization').split(' ')
      if (authSplit.length === 2) {
        authHeader = authSplit[1]
      }
    }
    const authQuery = req.query.auth
    const auth = authHeader || authQuery

    if (!auth) {
      throw new GenericError('No token provided.', 401)
    }

    const decoded = jwt.decode(auth)
    const user = await db.models.User.findOne({ where: { id: decoded.userId } })

    if (!user) {
      throw new GenericError('Invalid User Supplied in jwt')
    }

    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

module.exports = {
  asyncWrapper,
  authMiddleware
}
