const { ValidationError, GenericError } = require('./helpers/errors')
const router = require('express').Router()
const settings = require('./settings')
const generateQuote = require('./helpers/generate-quote')
const jwt = require('./helpers/jwt')
const db = require('./db')

router.get('/settings', (req, res, next) => {
  db.models.Participant.count({})
    .then((c) => {
      res.status(200).json({
        ...settings,
        currentParticipants: c
      })
    }).catch(next)
})

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

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quotes', (req, res, next) => {
  if (!req.body) throw new ValidationError('body', null, 'body is missing')

  generateQuote(req.body).then((quote) => {
    jwt.sign({ quote }, 'quote').then((token) => {
      res.status(200).json({ quote, jwt: token })
    }).catch(next)
  }).catch(next)
})

/** Payment API handlers **/
router.post('/payment', require('./routes/payment/post'))
router.post('/payment/execute', require('./routes/payment/execute'))

router.get('/orders/:id/:secret', require('./routes/orders/get-single'))

router.post('/auth', require('./routes/auth'))

router.get('/orders', authMiddleware, require('./routes/orders/get'))
router.get('/participants', authMiddleware, require('./routes/participants/get'))
router.get('/users', authMiddleware, require('./routes/users/get'))

module.exports = router
