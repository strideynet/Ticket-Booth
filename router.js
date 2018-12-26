const errors = require('./helpers/errors').types
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
    }).catch((err) => next(err))
})

const authMiddleware = (req, res, next) => {
  const auth = req.get('Authorization') && req.get('Authorization').split(' ')
  if (auth && auth[0] === 'Bearer' && auth[1]) {
    jwt.decode(auth[1])
      .then(decoded => db.models.User.findOne({ where: { id: decoded.userID } }))
      .then(user => {
        if (!user) {
          throw new errors.ValidationError('Invalid User Supplied')
        }

        req.user = user
        next()
      })
      .catch(next)
  } else {
    res.status(401).json({
      type: 'Unauthorized',
      message: 'No valid token presented'
    })
  }
}

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quotes', (req, res, next) => {
  if (!req.body) throw new errors.ValidationError('No body supplied.')

  generateQuote(req.body).then((quote) => {
    jwt.sign({ quote }, 'quote').then((token) => {
      res.status(200).json({ quote, jwt: token })
    }).catch((err) => next(err))
  }).catch((err) => next(err))
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
